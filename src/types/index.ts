import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { Dispatch, SetStateAction, SyntheticEvent } from "react";

export type ActiveTaskState = string | null;

export interface SortableItemProps {
    task: Task;
    key: number;
    activeTask: ActiveTaskState;
    setActiveTask: Dispatch<SetStateAction<ActiveTaskState>>;
    tasks: Task[];
    setTasks: Dispatch<SetStateAction<Task[]>>;
}

export interface TaskContainerProps {
    activeTask: ActiveTaskState;
    task: Task | Subtask;
    subtasks?: Subtask[];
    containerId: string;
    containerStyle: React.CSSProperties;
    containerRef?: (node: HTMLElement | null) => void;
    containerListeners?: SyntheticListenerMap | undefined;
    containerAttributes?: DraggableAttributes;
    iconContainerId: string;
    iconContainerClass: string;
    iconContainerOnClick: (event: SyntheticEvent) => void;
    accordionContainerId: string;
    accordionContainerStyle: React.CSSProperties;
    accordionStyle: React.CSSProperties;
    accordionIsExpanded: boolean;
    accordionOnChange: (e: SyntheticEvent, isExpanded: boolean) => void;
    typographyStylePosition?: React.CSSProperties;
    typographyTextPosition?: string;
    typographyStyleTitle: React.CSSProperties;
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
