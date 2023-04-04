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

export class ReminderCdkStack extends NestedStack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // cognito (user pool, user pool group)
        // api gateway -> lambda -> scheduler
        // scheduler
        // sqs
        // lambda(?)
        // sns

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
                resources: [this.stackId],
                actions: ["cloudformation:DescribeStacks"],
            })
        );
        reminderTopic.grantPublish(messengerLambda);

        createCfnOutputs(this, {
            reminderQueueArn: reminderQueue.queueArn,
            reminderTopicArn: reminderTopic.topicArn,
            schedulerDlQueueArn: schedulerDlQueue.queueArn,
            schedulerTargetRoleArn: role.roleArn,
            snsDlQueueArn: snsDlQueue.queueArn,
        });

        /*
            "amplify init"
            "amplify add api"
            | - graphql or rest: rest
            | - which template:  serverless express (or CRUD dynamodb)
            | - name of lambda
            | - edit code now
            ...
            // CANNOT USE AMPLIFY IN SAME WAY FOR CDK
            // HAVE TO USE APIGATEWAY AND COGNITO DIRECTLY
        */

        /*
            USING CDK:

            Create all of the api gateways with their lambdas

                const helloLambdaFunction = new NodejsFunction(this, 'helloLambda');
                const happyLambdaFunction = new NodejsFunction(this, 'happyLambda');

                const api = new apigateway.RestApi(this, 'hello-api', {
                description: 'This service is Happy.',
                });

                const helloLambdaPath = api.root.addResource('helloLambda'); 
                // path name https://{createdId}.execute-api.{region}.amazonaws.com/prod/helloLambda

                helloLambdaPath.addMethod('GET', new apigateway.LambdaIntegration(helloLambdaFunction));

                const happyLambdaPath = api.root.addResource('happyLambda'); 
                // path name https://{createdId}.execute-api.{region}.amazonaws.com/prod/happyLambda

                happyLambdaPath.addMethod('GET', new apigateway.LambdaIntegration(happyLambdaFunction));

            create reminderSqsQueue
            create sqsDocument Policy to be assumed by scheduler
            create snsTopic

            create relevant CloudFormation (cfn) outputs
            - reminderSqsQueue
            - reminderSnsTopic
            - schedulerToSQSReminderQueueRole
            - schedulerDlQueue
            - API Gateway URL

            


            USING SDK:

            on account creation:
                |- subscribe account to snsTopic (get topic arn from cloudformation output)
                    |- apply a Subscription Filter Policy to the MessageAttributes 
                        so that only get notifs where account in `send_to` attribute

            on receive reminder:
            | - ensure a scheduleGroup for the reminder's task exists (can maybe try assuming role on group(?))
            | - create a scheduler 
                | 
                | - set groupName, scheduleExpression, scheduleExpressionTimezone, flexTimeWindow ({mode: "OFF"})
                | - set target
                    | - arn points to the reminderSqsQueue (get queue arn from cloudformation stack output)
                    | - assume the role which gives SendMessage perms to reminderSqsQueue (get role arn from cloudformation stack output)
                    | - input (the stringified reminder json)
                    | - deadLetterConfig = schedulerDlQueueARN (get arn from cloudformation stack output)
                    | - retry policy
        */

        // THIS NEEDS TO BE CHANGED TO SDK SINCE NEEDS TO BE DYNAMIC
        // const reminderScheduleGroup = new scheduler.CfnScheduleGroup(this, "task-13-reminders", {name: "task-13-reminders"});
        // const reminderSchedule = new scheduler.CfnSchedule(
        //     this,
        //     "reminder-23",
        //     {
        //         groupName: reminderScheduleGroup.name,
        //         scheduleExpression: "at(2023-04-14T07:36:21)", // env variable(?)
        //         scheduleExpressionTimezone: "UTC",
        //         flexibleTimeWindow: {mode: "OFF"},
        //         target: {
        //             arn : reminderQueue.queueArn,
        //             deadLetterConfig: {
        //                 arn: schedulerDlQueue.queueArn,
        //             },
        //             input: JSON.stringify({reminder_id: 23, task_id: 13, content: "Don't forget about task #13!"}),

        //             roleArn : role.roleArn,
        //             retryPolicy : {
        //                 maximumEventAgeInSeconds: ...,
        //                 maximumRetryAttempts: ...
        //             }
        //         }
        //     })
    }
}
