import * as cdk from "aws-cdk-lib";
import { CloudFormationClient, DescribeStacksCommand } from "@aws-sdk/client-cloudformation";
type ExportName = string;
type OutputValue = string;
type Outputs = Record<ExportName, OutputValue>;

const cfClient = new CloudFormationClient({});

export function createCfnOutputs(stack: cdk.Stack, outputs: Outputs) {
    for (let [exportName, value] of Object.entries(outputs)) {
        new cdk.CfnOutput(stack, exportName, { exportName, value });
    }
}

export async function getCfnOutput(stackName: string, outputKey: string) {
    const { Stacks: stacks } = await cfClient.send(
        new DescribeStacksCommand({
            StackName: "ReminderCDKStack",
        })
    );

    if (!stacks || stacks.length === 0) {
        throw new Error(`Stack "${stackName}" was not found`);
    }

    const output = stacks[0].Outputs?.find(output => output.OutputKey === outputKey);
    if (!(output && output.OutputValue)) {
        throw new Error(`Key "${outputKey}" was not found`);
    }
    return output.OutputValue;
}
