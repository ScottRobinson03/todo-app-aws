#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { TodoCDKStack } from "../lib/stacks/main-stack";

const app = new cdk.App();
new TodoCDKStack(app, "TodoCDKStack");
