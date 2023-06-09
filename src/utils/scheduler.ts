import { Auth } from "aws-amplify";
import { ReminderPayload } from "../types";

export async function createReminderSchedule(reminderPayload: ReminderPayload) {
    const resp = await fetch(
        "https://r5puobef37.execute-api.eu-west-2.amazonaws.com/dev/reminders",
        {
            body: JSON.stringify(reminderPayload),
            headers: {
                Authorization: (await Auth.currentSession()).getIdToken().getJwtToken(),
                "Content-Type": "application/json",
            },
            method: "POST",
        }
    );
    console.log(resp);
}
