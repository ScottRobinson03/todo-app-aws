import { Auth } from "aws-amplify";
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
