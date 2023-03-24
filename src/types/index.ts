import { Dispatch, SetStateAction } from "react";

export type ActiveTaskState = Task["id"] | null;

export interface SortableItemProps extends Task {
    key: number;
    activeTask: ActiveTaskState;
    setActiveTask: Dispatch<SetStateAction<ActiveTaskState>>;
    setTasks: Dispatch<SetStateAction<Task[]>>;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    position?: number;
    completedAt: string | null;
    children: Subtask[];
}

export type Subtask = Omit<Task, "children" | "description" | "position">;
