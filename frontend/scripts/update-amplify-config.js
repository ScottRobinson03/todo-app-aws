const {
    getOutputsFromStack,
} = require("@sky-uk/coins-testing-utilities/src/lib/system-tests/cloudFormation");
const fs = require("fs");
const path = require("path");

async function main() {
    const outputs = await getOutputsFromStack("TodoCDKStack", {
        userPoolId: "userPoolId",
        userPoolName: "userPoolName",
        userPoolClientId: "userPoolClientId",
    });

    const configPath = path.join(__dirname, "../amplify/team-provider-info.json");
    const contents = fs.readFileSync(configPath);
    const json = JSON.parse(contents);
    json.dev.categories.auth.todoapp7e4d1499 = {
        userPoolId: outputs.userPoolId,
        userPoolName: outputs.userPoolName,
        webClientId: outputs.userPoolClientId,
        nativeClientId: outputs.userPoolClientId,
    };
    fs.writeFileSync(configPath, JSON.stringify(json, null, 2));
}

main()
    .then(console.log("Finished updating Amplify team-provider-info config"))
    .catch(console.error);
