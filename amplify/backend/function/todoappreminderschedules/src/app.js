/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

import cors from "cors";
import pkg from "body-parser";
import express from "express";
import { eventContext } from "aws-serverless-express/middleware.js";
import { CreateScheduleCommand, SchedulerClient } from "@aws-sdk/client-scheduler";
import { CloudFormationClient, DescribeStacksCommand } from "@aws-sdk/client-cloudformation";

// declare a new express app
const { json } = pkg;
const app = express();
app.use(cors());
app.use(eventContext());
app.use(json());

const cloudFormationClient = new CloudFormationClient({});
const schedulerClient = new SchedulerClient({});

function getOutputByKey(outputs, outputKey) {
    const output = outputs?.find(o => o.OutputKey === outputKey);
    if (!output || !output.OutputValue) {
        throw new Error(`Key "${outputKey}"" was not found`);
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

app.get("/reminder/:reminderId", async function (req, res) {
    res.json({ success: "get call succeed!", url: req.url });
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
        const typeofValue = typeof value;
        if (typeofValue !== "string") {
            res.status(400).json({
                message: `Request body key '${requiredBodyKey}' must be of type 'string' (got '${typeofValue}')`,
            });
            return;
        }
    }

    let response;
    try {
        const reminderCdkStackArn = await getOutputFromStack("TodoCDKStack", "reminderStack");
        if (!reminderCdkStackArn) {
            res.status(500).json({ message: "Failed to retrieve reminder stack arn" });
            return;
        }
        const reminderCdkStackId = reminderCdkStackArn.split("/")[1];

        const reminderStackOutputs = await getOutputsFromStack(reminderCdkStackId, [
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
                Name: "",
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
        if (response.$metadata.httpStatusCode !== 200) {
            res.status(response.$metadata.httpStatusCode ?? 500).json(response);
            return;
        }
    } catch (exc) {
        res.status(500).json(exc);
        return;
    }
    res.send(response);
});

app.patch("/reminder/:reminderId", async function (req, res) {
    // Add your code here
    res.json({ success: "patch call succeed!", url: req.url, body: req.body });
});

app.delete("/reminder/:reminderId", async function (req, res) {
    // Add your code here
    res.json({ success: "delete call succeed!", url: req.url });
});

app.listen(3000, function () {
    console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
export default app;
