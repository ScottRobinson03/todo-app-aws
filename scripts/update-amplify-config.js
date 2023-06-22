import awsmobile from "../src/aws-exports";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiObj = awsmobile["aws_cloud_logic_custom"].find(obj => obj.name === "todoapprestapi");
if (!apiObj) throw new Error("Failed to find url for todoapprestapi");
const rootUrl = apiObj["endpoint"];

function getOutputByKey(outputs, outputKey) {
    const output = outputs?.find(o => o.OutputKey === outputKey);
    if (!output || !output.OutputValue) {
        throw new Error(`Key "${outputKey}" was not found`);
    }
    return output.OutputValue;
}

async function getStackOutputs(stackName) {
    const response = await fetch(`${rootUrl}/stackoutputs/${stackName}`);
    const json = await response.json();
    if (!json.stackOutputs) {
        throw new Error(`Failed to get stack outputs. JSON: ${JSON.stringify(json, null, 2)}`);
    }
    return json.stackOutputs;
}

async function getOutputsFromStack(stackName, outputKeys) {
    const outputs = await getStackOutputs(stackName);

    return outputKeys.reduce((acc, outputKey) => {
        acc[outputKey] = getOutputByKey(outputs, outputKey);
        return acc;
    }, {});
}

async function main() {
    const outputs = await getOutputsFromStack("TodoCDKStack", [
        "allowUnauthenticatedIdentities",
        "authRoleArn",
        "authRoleName",
        "identityPoolId",
        "identityPoolName",
        "nativeClientId",
        "unauthRoleArn",
        "unauthRoleName",
        "webClientId",
    ]);

    const configPath = path.join(__dirname, "../amplify/team-provider-info.json");
    const contents = fs.readFileSync(configPath);
    const json = JSON.parse(contents);

    const authId = Object.keys(json.dev.categories.auth)[0];
    for (let [key, value] of Object.entries(outputs)) {
        if (key === "allowUnauthenticatedIdentities") {
            value = JSON.parse(value); // convert "true"/"false" -> true/false
        }
        json.dev.categories.auth[authId][key] = value;
    }

    const cloudformationReplacements = {
        AuthRoleArn: outputs.authRoleArn,
        AuthRoleName: outputs.authRoleName,
        UnauthRoleArn: outputs.unauthRoleArn,
        UnauthroleName: outputs.unauthRoleName,
    };
    for (const [key, value] of Object.entries(cloudformationReplacements)) {
        json.dev.awscloudformation[key] = value;
    }

    fs.writeFileSync(configPath, JSON.stringify(json, null, 2));
}

main()
    .then(() => console.log("Finished updating Amplify team-provider-info config"))
    .catch(console.error);
