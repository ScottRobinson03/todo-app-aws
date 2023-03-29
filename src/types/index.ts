import { Dispatch, SetStateAction } from "react";

export type ActiveTaskState = string | null;

export interface SortableItemProps extends Task {
    key: number;
    activeTask: ActiveTaskState;
    setActiveTask: Dispatch<SetStateAction<ActiveTaskState>>;
    tasks: Task[];
    setTasks: Dispatch<SetStateAction<Task[]>>;
}

export interface Task {
    id: number;
    title: string;
    description: string | null;
    position: number;
    completedAt: string | null;
    children: Subtask[];
}

export type Subtask = Omit<Task, "children" | "position">;
