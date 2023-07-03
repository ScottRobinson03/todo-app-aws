import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { Dispatch, SetStateAction, SyntheticEvent } from "react";
import {
    AccountTask,
    DeleteTaskInput,
    Account as GraphQLAccount,
    Subtask as GraphQLSubtask,
    Task as GraphQLTask,
    UpdateTaskInput,
    UpdateTaskMutation,
} from "../API";
import { UpdateAccountOptions } from "./graphql";

export interface ReminderPayload {
    reminder_id: string;
    task_id: string;
    content: string;
    due_at: string;
    send_to: string[];
}

type SetState<T> = Dispatch<SetStateAction<T>>;

type DeleteTask = (input: DeleteTaskInput, callUpdateAccount?: boolean) => Promise<string>;
type UpdateAccount = (options: UpdateAccountOptions, acc?: GraphQLAccount) => Promise<void>;
type UpdateTask = (
    options: Omit<
        {
            [k in keyof UpdateTaskInput]: k extends "completed_at" | "description"
                ? UpdateTaskInput[k]
                : NonNullable<Required<UpdateTaskInput>[k]>;
        },
        "taskCreated_bySub" | "taskCreated_byId"
    >
) => Promise<NonNullable<UpdateTaskMutation["updateTask"]>>;
type UserTask = Omit<GraphQLTask, "__typename">;

export type ActiveTaskState = string | null;

export interface SortableItemProps {
    accountSignedIn: GraphQLAccount;
    accountTask: AccountTask;
    accountTasks: AccountTask[];
    activeTask: ActiveTaskState;
    setActiveTask: SetState<ActiveTaskState>;
    deleteTask: DeleteTask;
    key: string;
    userTask: UserTask;
    userTasks: UserTask[];
    updateTask: UpdateTask;
}

export interface TaskContainerProps {
    accordionContainerId: string;
    accordionContainerStyle: React.CSSProperties;
    accordionStyle: React.CSSProperties;
    accordionIsExpanded: boolean;
    accordionOnChange: (e: SyntheticEvent, isExpanded: boolean) => void;
    accountSignedIn: GraphQLAccount;
    activeTask: ActiveTaskState;
    containerAttributes?: DraggableAttributes;
    containerId: string;
    containerListeners?: SyntheticListenerMap | undefined;
    containerRef?: (node: HTMLElement | null) => void;
    containerStyle: React.CSSProperties;
    deleteTask: DeleteTask;
    iconContainerClass: string;
    iconContainerId: string;
    iconContainerOnClick: (event: SyntheticEvent) => void;
    typographyStylePosition?: React.CSSProperties;
    typographyStyleTitle: React.CSSProperties;
    typographyTextPosition?: string;
    updateTask: UpdateTask;
    userTask: UserTask | Omit<GraphQLSubtask, "__typename">;
    userTasks: UserTask[];
}

export interface TaskViewProps {
    accountSignedIn: GraphQLAccount;
    accountTasks: AccountTask[];
    setAccountTasks: SetState<AccountTask[]>;
    deleteTask: DeleteTask;
    updateAccount: UpdateAccount;
    updateTask: UpdateTask;
    userTasks: UserTask[];
}
