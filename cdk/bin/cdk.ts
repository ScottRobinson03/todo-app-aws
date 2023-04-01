#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { ReminderCdkStack } from "../lib/stacks/reminder-stack";

const app = new cdk.App();
new ReminderCdkStack(app, "ReminderCDKStack");
