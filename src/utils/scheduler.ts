import { Auth } from "aws-amplify";
import { Task as GraphQLTask } from "../API";
import awsmobile from "../aws-exports";
import { ReminderPayload } from "../types";

const apiObj = awsmobile["aws_cloud_logic_custom"].find(obj => obj.name === "todoapprestapi");
if (!apiObj) throw new Error("Failed to find url for todoapprestapi");
const rootUrl = apiObj["endpoint"];

export async function createReminderSchedule(reminderPayload: ReminderPayload) {
    const resp = await fetch(`${rootUrl}/reminders`, {
        body: JSON.stringify(reminderPayload),
        headers: {
            Authorization: (await Auth.currentSession()).getIdToken().getJwtToken(),
            "Content-Type": "application/json",
        },
        method: "POST",
    });
    console.log(resp);
}

export async function deleteReminderSchedules(task_id?: GraphQLTask["id"]) {
    const resp = await fetch(`${rootUrl}/reminders`, {
        body: JSON.stringify({ task_id }),
        headers: {
            Authorization: (await Auth.currentSession()).getIdToken().getJwtToken(),
            "Content-Type": "application/json",
        },
        method: "DELETE",
    });
    console.log(resp);

    const json = await resp.json();
    console.log(JSON.stringify(json, null, 2));
    const totalReminders = json.deleted.length + json.failed.length;
    if (json.failed.length) {
        console.log(
            `WARNING: Failed to delete ${json.failed.length}/${totalReminders} reminders linked to task ${task_id}.`
        );
    } else {
        console.log(
            `Successfully deleted all ${totalReminders} reminders linked to task ${task_id}.`
        );
    }
}