import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { Dispatch, SetStateAction, SyntheticEvent } from "react";
import { AccountTask, Subtask as GraphQLSubtask, Task as GraphQLTask} from "../API";

export type ActiveTaskState = string | null;

export interface SortableItemProps {
    accountTask: AccountTask;
    accountTasks: AccountTask[];
    userTask: Omit<GraphQLTask, "__typename">;
    key: AccountTask["task_id"];
    activeTask: ActiveTaskState;
    setActiveTask: Dispatch<SetStateAction<ActiveTaskState>>;
    userTasks: Omit<GraphQLTask, "__typename">[];
    setAccountTasks: Dispatch<SetStateAction<AccountTask[]>>;
    setUserTasks: Dispatch<SetStateAction<Omit<GraphQLTask, "__typename">[]>>;
}

export interface TaskContainerProps {
    activeTask: ActiveTaskState;
    userTask: Omit<GraphQLTask, "__typename"> | Omit<GraphQLSubtask, "__typename">;
    subtasks?: GraphQLSubtask[];
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

export interface TaskViewProps {
    accountTasks: AccountTask[];
    setAccountTasks: Dispatch<SetStateAction<AccountTask[]>>
    userTasks: Omit<GraphQLTask, "__typename">[];
    setUserTasks: Dispatch<SetStateAction<Omit<GraphQLTask, "__typename">[]>>
}
