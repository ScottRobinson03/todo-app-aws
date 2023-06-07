export interface ReminderPayload {
    reminder_id: string;
    task_id: string;
    content: string;
    due_at: string;
    send_to: string[];
}
