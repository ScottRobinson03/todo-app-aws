export interface ReminderPayload {
    reminder_id: number;
    task_id: number;
    content: string;
    due_at: string;
    send_to: string[];
}
