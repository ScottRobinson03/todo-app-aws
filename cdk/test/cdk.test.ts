import { App, Duration } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { TodoCDKStack } from "../lib/stacks/main-stack";

function testPropertiesHaveExpectedValues(obj: any, propertyToValueMapping: Record<string, any>) {
    for (let [property, expectedValue] of Object.entries(propertyToValueMapping)) {
        test(`${property} is ${JSON.stringify(expectedValue)}`, () => {
            expect(obj).toHaveProperty(property, expectedValue);
        });
    }
}

describe("AWS Todo Stack", () => {
    const app = new App();
    const mainStack = new TodoCDKStack(app, "TodoTestStack");

    const mainTemplate = Template.fromStack(mainStack);
    describe("Cognito", () => {
        describe("TodoAppUserPool", () => {
            const matching = mainTemplate.findResources("AWS::Cognito::UserPool", {
                Properties: { UserPoolName: "TodoAppUserPool" },
            });
            const keys = Object.keys(matching);
            test("Exists", () => {
                expect(keys).toHaveLength(1);
            });
            const matchedPool = matching[keys[0]];
            const matchedPoolProps = matchedPool.Properties;

            testPropertiesHaveExpectedValues(matchedPool, {
                UpdateReplacePolicy: "Retain",
                DeletionPolicy: "Retain",
            });

            testPropertiesHaveExpectedValues(matchedPoolProps, {
                AccountRecoverySetting: {
                    RecoveryMechanisms: [{ Name: "verified_email", Priority: 1 }],
                },
                AliasAttributes: ["email"],
                AutoVerifiedAttributes: ["email", "phone_number"],
                DeletionProtection: "ACTIVE",
                EmailConfiguration: { EmailSendingAccount: "COGNITO_DEFAULT" },
                EmailVerificationMessage:
                    "Thanks for signing up to our awesome todo app! Your verification code is {####}",
                EmailVerificationSubject: "Verify your email for our todo app",
                EnabledMfas: ["SMS_MFA", "SOFTWARE_TOKEN_MFA"],
                MfaConfiguration: "OPTIONAL",
                SmsVerificationMessage:
                    "Thanks for signing up to our awesome todo app! Your verification code is {####}",
            });

            describe("AdminCreateUserConfig", () => {
                testPropertiesHaveExpectedValues(matchedPoolProps.AdminCreateUserConfig, {
                    AllowAdminCreateUserOnly: false,
                });
                describe("InviteMessageTemplate", () => {
                    testPropertiesHaveExpectedValues(
                        matchedPoolProps.AdminCreateUserConfig.InviteMessageTemplate,
                        {
                            EmailMessage:
                                "Hello {username}, you have been invited to join our awesome todo app! Your temporary password is {####}",
                            EmailSubject: "Invite to join our todo app!",
                            SMSMessage:
                                "Hello {username}, your temporary password for our awesome todo app is {####}",
                        }
                    );
                });
            });

            describe("DeviceConfiguration", () => {
                testPropertiesHaveExpectedValues(matchedPoolProps.DeviceConfiguration, {
                    ChallengeRequiredOnNewDevice: true,
                    DeviceOnlyRememberedOnUserPrompt: true,
                });
            });

            describe("Policies", () => {
                describe("PasswordPolicy", () => {
                    testPropertiesHaveExpectedValues(matchedPoolProps.Policies.PasswordPolicy, {
                        MinimumLength: 6,
                        RequireLowercase: true,
                        RequireNumbers: true,
                        RequireSymbols: false,
                        RequireUppercase: true,
                        TemporaryPasswordValidityDays: 2,
                    });
                });
            });

            describe("Schema", () => {
                test("Isn't empty", () => {
                    expect(matchedPoolProps.Schema.length).toBeGreaterThan(0);
                });
                const expectedSchemas: Record<string, Record<"mutable" | "required", boolean>> = {
                    email: {
                        mutable: true,
                        required: true,
                    },
                    name: {
                        mutable: false,
                        required: true,
                    },
                    updated_at: {
                        mutable: true,
                        required: true,
                    },
                    phone_number: {
                        mutable: true,
                        required: true,
                    },
                    zoneinfo: {
                        mutable: true,
                        required: true,
                    },
                };
                for (const schema of matchedPoolProps.Schema) {
                    const expectedForSchema = expectedSchemas[schema.Name];
                    describe(schema.Name, () => {
                        test(`${expectedForSchema.required ? "Is" : "Isn't"} Required`, () => {
                            expect(schema.Required).toEqual(expectedForSchema.required);
                        });
                        test(`${expectedForSchema.mutable ? "Is" : "Isn't"} Mutable`, () => {
                            expect(schema.Mutable).toEqual(expectedForSchema.mutable);
                        });
                    });
                }
            });

            describe("UserAttributeUpdateSettings", () => {
                testPropertiesHaveExpectedValues(matchedPoolProps.UserAttributeUpdateSettings, {
                    AttributesRequireVerificationBeforeUpdate: ["email", "phone_number"],
                });
            });

            describe("UserPoolAddOns", () => {
                testPropertiesHaveExpectedValues(matchedPoolProps.UserPoolAddOns, {
                    AdvancedSecurityMode: "OFF",
                });
            });

            describe("VerificationMessageTemplate", () => {
                testPropertiesHaveExpectedValues(matchedPoolProps.VerificationMessageTemplate, {
                    DefaultEmailOption: "CONFIRM_WITH_CODE",
                });
            });
        });
        describe("'Admins' User Pool Group", () => {
            const matching = mainTemplate.findResources("AWS::Cognito::UserPoolGroup", {
                Properties: { GroupName: "Admins" },
            });
            console.log(JSON.stringify(matching));
            const keys = Object.keys(matching);
            test("Exists", () => {
                expect(keys).toHaveLength(1);
            });
            const matchedGroup = matching[keys[0]];
            const matchedGroupProps = matchedGroup.Properties;
            testPropertiesHaveExpectedValues(matchedGroupProps, {
                Description: "A group for admins of the todo application",
                Precedence: 0,
            });
        });
    });

    describe("Reminder NestedStack", () => {
        test("Exists", () => {
            expect(mainStack).toHaveProperty("reminderStack");
        });
        const { reminderStack } = mainStack;
        const reminderTemplate = Template.fromStack(reminderStack);

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
                    const matching = reminderTemplate.findResources("AWS::SQS::Queue", {
                        Properties: { QueueName: queue.QueueName },
                    });
                    const keys = Object.keys(matching);
                    test("Exists", () => {
                        expect(keys).toHaveLength(1);
                    });
                    const matchedQueue = matching[keys[0]];
                    const matchedQueueProps = matchedQueue.Properties;
                    testPropertiesHaveExpectedValues(matchedQueueProps, {
                        MessageRetentionPeriod: queue.MessageRetentionPeriod,
                        VisibilityTimeout: queue.VisibilityTimeout,
                    });
                });
            }
        });
        describe("SNS", () => {
            const topics = ["ReminderTopic"];
            for (let topic of topics) {
                describe(topic, () => {
                    reminderTemplate.hasResource("AWS::SNS::Topic", {
                        Properties: { TopicName: topic },
                    });
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
                    const matching = reminderTemplate.findResources("AWS::Lambda::Function", {
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
                                    expect.arrayContaining([
                                        expect.stringMatching(dependency.Value),
                                    ])
                                );
                            });
                        }
                    });
                    testPropertiesHaveExpectedValues(matchedFuncProps, {
                        Handler: func.Handler,
                        Runtime: func.Runtime,
                    });
                    test("Has the correct Role", () => {
                        expect(matchedFuncProps.Role["Fn::GetAtt"]).toEqual(
                            expect.arrayContaining([expect.stringMatching(func.Role), "Arn"])
                        );
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
                    const matching = reminderTemplate.findResources("AWS::IAM::Role", {
                        Properties: { RoleName: role.RoleName },
                    });
                    const keys = Object.keys(matching);
                    test("Exists", () => {
                        expect(keys).toHaveLength(1);
                    });
                    const matchedRole = matching[keys[0]];
                    const matchedRoleProps = matchedRole.Properties;
                    testPropertiesHaveExpectedValues(matchedRoleProps, {
                        Description: role.Description,
                    });
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
                    const matching = reminderTemplate.findOutputs(output.Name, {
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
});
