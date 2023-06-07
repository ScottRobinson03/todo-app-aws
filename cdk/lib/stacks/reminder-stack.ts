import { Duration, NestedStack, StackProps } from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as sns from "aws-cdk-lib/aws-sns";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";
import * as path from "node:path";
import { createCfnOutputs } from "../utils";
import { CfnScheduleGroup } from "aws-cdk-lib/aws-scheduler";

export class ReminderCdkStack extends NestedStack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // DeadLetter queue for scheduler -> sqs
        const schedulerDlQueue = new sqs.Queue(this, "ReminderSchedulerDLQueue", {
            queueName: "ReminderSchedulerDLQueue",
            retentionPeriod: Duration.days(14),
            visibilityTimeout: Duration.minutes(5),
        });

        // DeadLetter queue for sqs -> sns
        const sqsDlQueue = new sqs.Queue(this, "ReminderSqsDLQueue", {
            queueName: "ReminderSqsDLQueue",
            retentionPeriod: Duration.days(14),
            visibilityTimeout: Duration.minutes(5),
        });

        // Might need to manually grant perms to the dlQueue
        const reminderQueue = new sqs.Queue(this, "ReminderQueue", {
            queueName: "ReminderQueue",
            retentionPeriod: Duration.minutes(30), // how long SNS has to receive the reminder and publish it
            visibilityTimeout: Duration.minutes(5), // how long SNS has to handle the reminder once it reads it
            deadLetterQueue: {
                maxReceiveCount: 3,
                queue: sqsDlQueue,
            },
        });
        // reminderQueue.grantSendMessages(dlQueue) // might need to manually give perms to Dl Queue

        // Policy that grants SendMessage perms to reminder & scheduler DL queue
        const sqsDocument = new iam.ManagedPolicy(this, "sqsSendReminderMessagesPolicy", {
            description: "Grants sqs:SendMessage to the reminder and scheduler deadletter queue",
            managedPolicyName: "sqsSendReminderMessagesPolicy",
            statements: [
                new iam.PolicyStatement({
                    resources: [reminderQueue.queueArn, schedulerDlQueue.queueArn], // might not need dlqueue here(?)
                    actions: ["sqs:SendMessage"],
                }),
            ],
        });

        // A role with the policy that can be assumed by the AWS scheduler service
        const role = new iam.Role(this, "SchedulerToSqsReminderQueueRole", {
            assumedBy: new iam.ServicePrincipal("scheduler.amazonaws.com"),
            description: "Role assumed by the reminders scheduler",
            roleName: "SchedulerToSqsReminderQueueRole",
            managedPolicies: [sqsDocument],
        });

        // The SNS Topic to publish reminders to
        const reminderTopic = new sns.Topic(this, "ReminderTopic", {
            topicName: "ReminderTopic",
        });

        const eventBridgeScheduleGroup = new CfnScheduleGroup(this, "ReminderScheduleGroup", {
            name: "ReminderScheduleGroup",
        });

        // Dead Letter queue for any SNS -> Subscription
        const snsDlQueue = new sqs.Queue(this, "ReminderSnsDLQueue", {
            queueName: "ReminderSnsDLQueue",
            retentionPeriod: Duration.days(14),
            visibilityTimeout: Duration.minutes(5),
        });

        // The lambda responsible for reading from the reminder queue and publishing to the reminder topic
        const messengerLambda = new lambda.NodejsFunction(this, "ReminderMessenger", {
            entry: path.join(__dirname, "../constructs/functions/ReminderMessenger/index.ts"),
            functionName: "ReminderMessenger",
            runtime: Runtime.NODEJS_16_X,
        });
        messengerLambda.addEventSource(new SqsEventSource(reminderQueue));

        messengerLambda.addToRolePolicy(
            new iam.PolicyStatement({
                resources: [
                    this.nestedStackParent!.stackId,
                    `${this.nestedStackParent!.stackId}/*`,
                    this.stackId,
                    `${this.stackId}/*`,
                ],
                actions: ["cloudformation:DescribeStacks"],
            })
        );
        reminderTopic.grantPublish(messengerLambda);

        createCfnOutputs(this, {
            reminderQueueArn: reminderQueue.queueArn,
            reminderTopicArn: reminderTopic.topicArn,
            scheduleGroupName: eventBridgeScheduleGroup.name!,
            schedulerDlQueueArn: schedulerDlQueue.queueArn,
            schedulerTargetRoleArn: role.roleArn,
            snsDlQueueArn: snsDlQueue.queueArn,
        });
    }
}
