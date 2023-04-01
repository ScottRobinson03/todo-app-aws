import { App, Duration } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { ReminderCdkStack } from "../lib/stacks/reminder-stack";

describe("AWS Reminder Stack", () => {
    const app = new App();
    const stack = new ReminderCdkStack(app, "ReminderTestStack");

    const template = Template.fromStack(stack);
    describe("SQS", () => {
        const queues = [
            {
                QueueName: "ReminderSchedulerDLQueue",
                MessageRetentionPeriod: Duration.days(14).toSeconds(),
                VisibilityTimeout: Duration.minutes(5).toSeconds(),
            },
            {
                QueueName: "ReminderSqsDLQueue",
                MessageRetentionPeriod: Duration.days(14).toSeconds(),
                VisibilityTimeout: Duration.minutes(5).toSeconds(),
            },
            {
                QueueName: "ReminderQueue",
                MessageRetentionPeriod: Duration.minutes(30).toSeconds(),
                VisibilityTimeout: Duration.minutes(5).toSeconds(),
            },
            {
                QueueName: "ReminderSnsDLQueue",
                MessageRetentionPeriod: Duration.days(14).toSeconds(),
                VisibilityTimeout: Duration.minutes(5).toSeconds(),
            },
        ];
        for (let queue of queues) {
            describe(queue.QueueName, () => {
                const matching = template.findResources("AWS::SQS::Queue", {
                    Properties: { QueueName: queue.QueueName },
                });
                const keys = Object.keys(matching);
                test("Exists", () => {
                    expect(keys).toHaveLength(1);
                });
                const matchedQueue = matching[keys[0]];
                const matchedQueueProps = matchedQueue.Properties;
                test("Has the correct MessageRetentionPeriod", () => {
                    expect(matchedQueueProps.MessageRetentionPeriod).toBe(
                        queue.MessageRetentionPeriod
                    );
                });
                test("Has the correct VisibilityTimeout", () => {
                    expect(matchedQueueProps.VisibilityTimeout).toBe(queue.VisibilityTimeout);
                });
            });
        }
    });
    describe("SNS", () => {
        const topics = ["ReminderTopic"];
        for (let topic of topics) {
            describe(topic, () => {
                template.hasResource("AWS::SNS::Topic", { Properties: { TopicName: topic } });
            });
        }
    });
    describe("Lambda", () => {
        const functions = [
            {
                DependsOn: [
                    {
                        Name: "ReminderMessengerServiceRole",
                        Value: /ReminderMessengerServiceRole[0-9A-Z]{8}/,
                    },
                    {
                        Name: "ReminderMessengerServiceRoleDefaultPolicy",
                        Value: /ReminderMessengerServiceRoleDefaultPolicy[0-9A-Z]{8}/,
                    },
                ],
                FunctionName: "ReminderMessenger",
                Handler: "index.handler",
                Role: /ReminderMessengerServiceRole[0-9A-Z]{8}/,
                Runtime: "nodejs16.x",
            },
        ];
        for (let func of functions) {
            describe(func.FunctionName, () => {
                const matching = template.findResources("AWS::Lambda::Function", {
                    Properties: { FunctionName: func.FunctionName },
                });
                const keys = Object.keys(matching);
                test("Exists", () => {
                    expect(keys).toHaveLength(1);
                });
                const matchedFunc = matching[keys[0]];
                const matchedFuncProps = matchedFunc.Properties;
                describe("Depends On", () => {
                    for (let dependency of func.DependsOn) {
                        test(dependency.Name, () => {
                            expect(matchedFunc.DependsOn).toEqual(
                                expect.arrayContaining([expect.stringMatching(dependency.Value)])
                            );
                        });
                    }
                });
                test("Has the correct Handler", () => {
                    expect(matchedFuncProps.Runtime).toBe(func.Runtime);
                });
                test("Has the correct Role", () => {
                    expect(matchedFuncProps.Role["Fn::GetAtt"]).toEqual(
                        expect.arrayContaining([expect.stringMatching(func.Role), "Arn"])
                    );
                });
                test("Has the correct Runtime", () => {
                    expect(matchedFuncProps.Runtime).toBe(func.Runtime);
                });
            });
        }
    });
    describe("IAM Role", () => {
        const roles = [
            {
                RoleName: "SchedulerToSqsReminderQueueRole",
                Description: "Role assumed by the reminders scheduler",
                ManagedPolicyArns: [
                    {
                        Name: "sqsSendReminderMessagesPolicy",
                        Value: /sqsSendReminderMessagesPolicy[0-9A-Z]{8}/,
                    },
                ],
                PrincipalService: "scheduler.amazonaws.com",
            },
        ];
        for (let role of roles) {
            describe(role.RoleName, () => {
                const matching = template.findResources("AWS::IAM::Role", {
                    Properties: { RoleName: role.RoleName },
                });
                const keys = Object.keys(matching);
                test("Exists", () => {
                    expect(keys).toHaveLength(1);
                });
                const matchedRole = matching[keys[0]];
                const matchedRoleProps = matchedRole.Properties;
                test("Has the correct AssumePolicyDocument", () => {
                    expect(matchedRoleProps.AssumeRolePolicyDocument).toEqual(
                        expect.objectContaining({
                            Statement: [
                                {
                                    Action: "sts:AssumeRole",
                                    Effect: "Allow",
                                    Principal: { Service: role.PrincipalService },
                                },
                            ],
                        })
                    );
                });
                test("Has the correct Description", () => {
                    expect(matchedRoleProps.Description).toBe(role.Description);
                });
                describe("ManagedPolicyArns", () => {
                    for (let ManagedPolicy of role.ManagedPolicyArns) {
                        test(ManagedPolicy.Name, () => {
                            expect(matchedRoleProps.ManagedPolicyArns).toEqual(
                                expect.arrayContaining([
                                    expect.objectContaining({
                                        Ref: expect.stringMatching(ManagedPolicy.Value),
                                    }),
                                ])
                            );
                        });
                    }
                });
            });
        }
    });
    describe("Outputs", () => {
        const outputs = [
            {
                Name: "reminderQueueArn",
                Value: /ReminderQueue[0-9A-Z]{8}/,
            },
            {
                Name: "reminderTopicArn",
                Value: /ReminderTopic[0-9A-Z]{8}/,
            },
            {
                Name: "schedulerDlQueueArn",
                Value: /ReminderSchedulerDLQueue[0-9A-Z]{8}/,
            },
            {
                Name: "schedulerTargetRoleArn",
                Value: /SchedulerToSqsReminderQueueRole[0-9A-Z]{8}/,
            },
            {
                Name: "snsDlQueueArn",
                Value: /ReminderSnsDLQueue[0-9A-Z]{8}/,
            },
        ];
        for (let output of outputs) {
            describe(output.Name, () => {
                const matching = template.findOutputs(output.Name, {
                    Export: { Name: output.Name },
                });
                const keys = Object.keys(matching);
                test("Exists", () => {
                    expect(keys).toHaveLength(1);
                });
                const matchedOutput = matching[keys[0]];
                test("Has expected value", () => {
                    const keys = Object.keys(matchedOutput.Value);

                    let actualValue;
                    if (keys[0] === "Fn::GetAtt") {
                        actualValue = matchedOutput.Value["Fn::GetAtt"][0];
                    } else if (keys[0] === "Ref") {
                        actualValue = matchedOutput.Value["Ref"];
                    }
                    expect(actualValue).toMatch(output.Value);
                });
            });
        }
    });
});
