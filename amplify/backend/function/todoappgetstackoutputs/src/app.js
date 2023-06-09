/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

import cors from "cors";
import express from "express";
import { eventContext } from "aws-serverless-express/middleware.js";
import { CloudFormationClient, DescribeStacksCommand } from "@aws-sdk/client-cloudformation";

// declare a new express app
const app = express();
app.use(cors());
app.use(eventContext());
app.use(express.json());

const cloudFormationClient = new CloudFormationClient({});

app.get("/stackoutputs/:stackName", async function (req, res) {
    const stackName = req.params.stackName;
    let stackOutputs;
    try {
        const response = await cloudFormationClient.send(
            new DescribeStacksCommand({ StackName: stackName })
        );
        if (response.$metadata.httpStatusCode !== 200) {
            res.status(response.$metadata.httpStatusCode ?? 500).json(response);
        }
        stackOutputs = response.Stacks[0].Outputs;
    } catch (exc) {
        res.status(500).json(exc);
        return;
    }
    res.json({ stackOutputs });
});

app.listen(3000, function () {
    console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
export default app;
