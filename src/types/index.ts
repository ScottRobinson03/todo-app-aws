import { Dispatch, SetStateAction } from "react";

export type ActiveTaskState = Task["id"] | null;

export interface SortableItemProps extends Task {
    key: number;
    activeTask: ActiveTaskState;
    setActiveTask: Dispatch<SetStateAction<ActiveTaskState>>;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    position?: number;
}
