import { Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { ReminderCdkStack } from "./reminder-stack";
import { createCfnOutputs } from "../utils";

export class TodoCDKStack extends Stack {
    public readonly reminderStack: ReminderCdkStack;
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        this.reminderStack = new ReminderCdkStack(this, "ReminderCDKStack");

        const userPoolName = "TodoAppUserPool";
        const userPool = new cognito.UserPool(this, userPoolName, {
            userPoolName,
            accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
            advancedSecurityMode: cognito.AdvancedSecurityMode.OFF,
            autoVerify: {
                email: true,
                phone: true,
            },
            deletionProtection: false,
            deviceTracking: {
                challengeRequiredOnNewDevice: true,
                deviceOnlyRememberedOnUserPrompt: true,
            },
            email: cognito.UserPoolEmail.withCognito(),
            keepOriginal: {
                email: true,
                phone: true,
            },
            mfa: cognito.Mfa.OPTIONAL,
            mfaSecondFactor: {
                sms: true, // you can't disable sms
                otp: true,
            },
            passwordPolicy: {
                minLength: 6,
                requireLowercase: true,
                requireUppercase: true,
                requireDigits: true,
                requireSymbols: false,
                tempPasswordValidity: Duration.days(2),
            },
            // If data is transferred to new cognito pool then change to destroy
            removalPolicy: RemovalPolicy.RETAIN,
            selfSignUpEnabled: true,
            signInAliases: {
                email: true,
                phone: false,
                username: true,
            },
            standardAttributes: {
                email: {
                    required: true,
                },
                fullname: {
                    required: true,
                    mutable: false,
                },
                phoneNumber: {
                    required: true,
                },
            },
            userInvitation: {
                emailSubject: "Invite to join our todo app!",
                emailBody:
                    "Hello {username}, you have been invited to join our awesome todo app! Your temporary password is {####}",
                smsMessage:
                    "Hello {username}, your temporary password for our awesome todo app is {####}",
            },
            userVerification: {
                emailSubject: "Verify your email for our todo app",
                emailBody:
                    "Thanks for signing up to our awesome todo app! Your verification code is {####}",
                emailStyle: cognito.VerificationEmailStyle.CODE,
                smsMessage:
                    "Thanks for signing up to our awesome todo app! Your verification code is {####}",
            },
        });

        const webClient = new cognito.UserPoolClient(this, "todoapp-web-client", {
            userPool: userPool,
            userPoolClientName: "todoapp-web-client",
        });

        const allowUnauthenticatedIdentities = true;
        const identityPool = new cognito.CfnIdentityPool(this, "todoapp-identity-pool", {
            allowUnauthenticatedIdentities,
            cognitoIdentityProviders: [
                {
                    clientId: webClient.userPoolClientId,
                    providerName: userPool.userPoolProviderName,
                },
            ],
            identityPoolName: "todoapp-identity-pool",
        });

        // Setup unauthenticated role
        const unauthenticatedRole = new iam.Role(this, "TodoAppUnauthenticatedRole", {
            assumedBy: new iam.FederatedPrincipal(
                "cognito-identity.amazonaws.com",
                {
                    StringEquals: { "cognito-identity.amazonaws.com:aud": identityPool.ref },
                    "ForAnyValue:StringLike": {
                        "cognito-identity.amazonaws.com:amr": "unauthenticated",
                    },
                },
                "sts:AssumeRoleWithWebIdentity"
            ),
            roleName: "TodoAppUnauthenticatedRole",
        });
        unauthenticatedRole.addToPolicy(
            new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: ["mobileanalytics:PutEvents", "cognito-sync:*"],
                resources: ["*"],
            })
        );
        unauthenticatedRole.addToPolicy(
            new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: ["cloudformation:DescribeStacks"],
                resources: [this.stackId, `${this.stackId}/*`],
            })
        );

        // Setup authenticated role
        const authenticatedRole = new iam.Role(this, "TodoAppAuthenticatedRole", {
            assumedBy: new iam.FederatedPrincipal(
                "cognito-identity.amazonaws.com",
                {
                    StringEquals: { "cognito-identity.amazonaws.com:aud": identityPool.ref },
                    "ForAnyValue:StringLike": {
                        "cognito-identity.amazonaws.com:amr": "authenticated",
                    },
                },
                "sts:AssumeRoleWithWebIdentity"
            ),
            roleName: "TodoAppAuthenticatedRole",
        });
        authenticatedRole.addToPolicy(
            new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: ["mobileanalytics:PutEvents", "cognito-sync:*", "cognito-identity:*"],
                resources: ["*"],
            })
        );

        // Add authenticated and unauthenticated roles to identity pool
        new cognito.CfnIdentityPoolRoleAttachment(this, "DefaultValid", {
            identityPoolId: identityPool.ref,
            roles: {
                unauthenticated: unauthenticatedRole.roleArn,
                authenticated: authenticatedRole.roleArn,
            },
        });

        const userPoolAdminGroup = new cognito.CfnUserPoolGroup(this, "TodoAppAdminGroup", {
            userPoolId: userPool.userPoolId,
            description: "A group for admins of the todo application",
            groupName: "Admin",
            precedence: 0, // 0 is the highest possible precedence
        });

        createCfnOutputs(this, {
            adminGroup: userPoolAdminGroup.groupName!,
            allowUnauthenticatedIdentities: allowUnauthenticatedIdentities ? "true" : "false",
            authRoleArn: authenticatedRole.roleArn,
            authRoleName: authenticatedRole.roleName,
            identityPoolId: identityPool.ref,
            identityPoolName: identityPool.identityPoolName!,
            nativeClientId: webClient.userPoolClientId, // web client is also the native client id
            reminderStack: this.reminderStack.stackId,
            unauthRoleArn: unauthenticatedRole.roleArn,
            unauthRoleName: unauthenticatedRole.roleName,
            userPoolArn: userPool.userPoolArn,
            userPoolId: userPool.userPoolId,
            userPoolName,
            webClientId: webClient.userPoolClientId,
        });
    }
}
