/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

import cors from "cors";
import express from "express";
import { eventContext } from "aws-serverless-express/middleware.js";
import {
    CreateScheduleCommand,
    DeleteScheduleCommand,
    GetScheduleCommand,
    ListSchedulesCommand,
    SchedulerClient,
} from "@aws-sdk/client-scheduler";
import { CloudFormationClient, DescribeStacksCommand } from "@aws-sdk/client-cloudformation";

// declare a new express app
const app = express();
app.use(cors());
app.use(eventContext());
app.use(express.json());

const cloudFormationClient = new CloudFormationClient({});
const schedulerClient = new SchedulerClient({});

function getOutputByKey(outputs, outputKey) {
    const output = outputs?.find(o => o.OutputKey === outputKey);
    if (!output || !output.OutputValue) {
        throw new Error(`Key "${outputKey}" was not found`);
    }
    return output.OutputValue;
}

async function getStackOutputs(stackName) {
    const { Stacks: stacks } = await cloudFormationClient.send(
        new DescribeStacksCommand({
            StackName: stackName,
        })
    );

    if (!stacks || stacks.length === 0) {
        throw new Error(`Stack "${stackName}" was not found`);
    }

    return stacks[0].Outputs;
}

async function getOutputFromStack(stackName, outputKey) {
    const outputs = await getStackOutputs(stackName);
    return getOutputByKey(outputs, outputKey);
}

async function getOutputsFromStack(stackName, outputKeys) {
    const outputs = await getStackOutputs(stackName);

    return outputKeys.reduce((acc, outputKey) => {
        acc[outputKey] = getOutputByKey(outputs, outputKey);
        return acc;
    }, {});
}

async function getReminderSchedules(res, taskId) {
    let reminderCdkStackName = null;
    try {
        reminderCdkStackName = await getOutputFromStack("TodoCDKStack", "reminderStackName");
    } catch (err) {
        res.status(500).json({ message: err.message });
        return -1;
    }

    if (!reminderCdkStackName) {
        res.status(500).json({ message: "Failed to retrieve reminder stack name" });
        return -1;
    }

    // TODO: Ensure doesn't return reminders that the user doesn't have access to
    const groupName = await getOutputFromStack(reminderCdkStackName, "scheduleGroupName");
    console.log(groupName);
    const { Schedules: reminderScheduleSummaries } = await schedulerClient.send(
        new ListSchedulesCommand({
            GroupName: groupName,
        })
    );
    console.log(reminderScheduleSummaries);

    console.log("Fetching expanded info...");
    let reminderSchedules = await Promise.all(
        reminderScheduleSummaries.map(async reminderScheduleSummary => {
            return schedulerClient.send(
                new GetScheduleCommand({
                    GroupName: reminderScheduleSummary.GroupName,
                    Name: reminderScheduleSummary.Name,
                })
            );
        })
    );
    console.log(reminderSchedules);

    if (taskId) {
        reminderSchedules = reminderSchedules.filter(
            reminderSchedule =>
                JSON.parse(reminderSchedule.Target.Input).task_id.split("|")[0] === taskId
        );
    }
    console.log(reminderSchedules);
    return reminderSchedules;
}

app.get("/reminder/:reminderId", async function (req, res) {
    const reminderId = req.params.reminderId;
    const reminderSchedule = await schedulerClient.send(
        new GetScheduleCommand({ Name: `reminder-${reminderId}` })
    );
    res.status(200).json(reminderSchedule);
});

app.patch("/reminder/:reminderId", async function (req, res) {
    // TODO: Implement PATCH /reminder/:reminderId
    res.json({ success: "patch call succeeded!", url: req.url, body: req.body });
});

app.delete("/reminder/:reminderId", async function (req, res) {
    let reminderCdkStackName = null;
    try {
        reminderCdkStackName = await getOutputFromStack("TodoCDKStack", "reminderStackName");
    } catch (err) {
        res.status(500).json({ message: err.message });
        return;
    }

    if (!reminderCdkStackName) {
        res.status(500).json({ message: "Failed to retrieve reminder stack name" });
        return;
    }

    const reminderId = req.params.reminderId;
    const response = await schedulerClient.send(
        new DeleteScheduleCommand({
            GroupName: await getOutputFromStack(reminderCdkStackName, "scheduleGroupName"),
            Name: `reminder-${reminderId}`,
        })
    );
    res.status(200).json({ response });
});

app.delete("/reminders", async function (req, res) {
    const reminders = await getReminderSchedules(res, req.body.task_id);
    if (reminders === -1) {
        // An erroneous response has been sent already
        return;
    }

    const results = await Promise.allSettled(
        reminders.map(async reminder => {
            const reminderId = reminder.Name.split("-").slice(1).join("-");
            const input = JSON.parse(reminder.Target.Input);
            try {
                await schedulerClient.send(
                    new DeleteScheduleCommand({
                        GroupName: reminder.GroupName,
                        Name: reminder.Name,
                    })
                );
            } catch (err) {
                return Promise.reject({
                    reminderId,
                    input,
                    message: err.message,
                });
            }
            return { reminderId, input };
        })
    );
    const deletionResults = {
        deleted: results
            .filter(result => result.status === "fulfilled")
            .map(result => result.value),
        failed: results.filter(result => result.status === "rejected").map(result => result.reason),
    };
    res.status(200).json(deletionResults);
});

app.get("/reminders", async function (req, res) {
    const reminderSchedules = await getReminderSchedules(res, req.body.task_id);
    if (reminderSchedules === -1) return; // an erroneous response has been returned already
    res.status(200).json({ reminderSchedules });
});

app.post("/reminders", async function (req, res) {
    const requiredBodyKeys = ["content", "due_at", "reminder_id", "send_to", "task_id"];
    for (const requiredBodyKey of requiredBodyKeys) {
        const value = req.body[requiredBodyKey];
        if (!value) {
            res.status(400).json({
                message: `Request body is missing the '${requiredBodyKey}' key`,
            });
            return;
        }
        // TODO: Add proper body validation
    }

    let response;
    let reminderCdkStackName = null;
    try {
        reminderCdkStackName = await getOutputFromStack("TodoCDKStack", "reminderStackName");
    } catch (err) {
        res.status(500).json({ message: err.message });
        return;
    }

    if (!reminderCdkStackName) {
        res.status(500).json({ message: "Failed to retrieve reminder stack name" });
        return;
    }

    try {
        const reminderStackOutputs = await getOutputsFromStack(reminderCdkStackName, [
            "reminderQueueArn",
            "schedulerDlQueueArn",
            "scheduleGroupName",
            "schedulerTargetRoleArn",
        ]);
        console.log(reminderStackOutputs);
        for (const [key, value] of Object.entries(getOutputsFromStack)) {
            if (!value) {
                res.status(500).json({ message: `Failed to find ${key} within reminder stack.` });
                return;
            }
        }
        response = await schedulerClient.send(
            new CreateScheduleCommand({
                GroupName: reminderStackOutputs.scheduleGroupName,
                FlexibleTimeWindow: { Mode: "OFF" },
                Name: `reminder-${req.body.reminder_id}`,
                ScheduleExpression: `at(${req.body.due_at})`,
                ScheduleExpressionTimezone: "UTC",
                Target: {
                    Arn: reminderStackOutputs.reminderQueueArn,
                    DeadLetterConfig: {
                        Arn: reminderStackOutputs.schedulerDlQueueArn,
                    },
                    Input: JSON.stringify(req.body),
                    RoleArn: reminderStackOutputs.schedulerTargetRoleArn,
                },
            })
        );
        console.log(response);
        if (response.$metadata.httpStatusCode !== 200) {
            res.status(response.$metadata.httpStatusCode ?? 500).json(response);
            return;
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
        return;
    }
    res.status(201).json(response);
});

app.listen(3000, function () {
    console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
export default app;
