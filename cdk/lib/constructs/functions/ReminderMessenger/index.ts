import { PublishBatchCommand, PublishBatchRequestEntry, SNSClient } from "@aws-sdk/client-sns";
import { Context, SQSEvent } from "aws-lambda";
import { ReminderPayload } from "./types";
import { getCfnOutput } from "../../../utils";

export async function handler(event: SQSEvent, context: Context) {
    console.log(JSON.stringify(event));
    console.log(JSON.stringify(context));

    // Send each record retrieved from the SQS Queue to SNS
    const snsClient = new SNSClient({});

    const messages: PublishBatchRequestEntry[] = [];
    for (let i = 0; i < event.Records.length; i++) {
        const record = event.Records[i];
        const body: ReminderPayload | undefined = JSON.parse(record.body);
        if (!body)
            throw new Error(
                `The record with an index of ${i} has an empty body:\n${JSON.stringify(
                    record,
                    undefined,
                    2
                )}`
            );
        console.log(JSON.stringify(body));

        // Convert the reminder data to a message that can be published to SNS
        messages.push({
            Id: body.reminder_id,
            Message: body.content,
            MessageAttributes: {
                due_at: {
                    DataType: "String",
                    StringValue: body.due_at,
                },
                task_id: {
                    DataType: "String",
                    StringValue: body.task_id,
                },
                send_to: {
                    DataType: "String.Array",
                    StringValue: JSON.stringify(body.send_to),
                },
            },
        });
    }

    console.log(JSON.stringify(messages));

    const reminderStackArn = await getCfnOutput("TodoCDKStack", "reminderStack");
    const result = await snsClient.send(
        new PublishBatchCommand({
            TopicArn: await getCfnOutput(reminderStackArn.split("/")[1], "reminderTopicArn"),
            PublishBatchRequestEntries: messages,
        })
    );
    console.log(JSON.stringify(result));
    if (result.Failed && result.Failed.length > 0) {
        throw new Error(`${result.Failed.length}/${messages.length} messages failed to send.`);
    }
}
