/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateAccountInput = {
  email: string,
  sub: string,
  is_admin: number,
  name: string,
  tasks: Array< AccountTaskInput >,
  username: string,
};

export type AccountTaskInput = {
  permissions: number,
  position: number,
  reminder_ids: Array< string >,
  task_id: string,
};

export type ModelAccountConditionInput = {
  email?: ModelStringInput | null,
  is_admin?: ModelIntInput | null,
  name?: ModelStringInput | null,
  username?: ModelStringInput | null,
  and?: Array< ModelAccountConditionInput | null > | null,
  or?: Array< ModelAccountConditionInput | null > | null,
  not?: ModelAccountConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type Account = {
  __typename: "Account",
  email: string,
  sub: string,
  is_admin: number,
  name: string,
  tasks:  Array<AccountTask >,
  username: string,
  createdAt: string,
  updatedAt: string,
};

export type AccountTask = {
  __typename: "AccountTask",
  permissions: number,
  position: number,
  reminder_ids: Array< string >,
  task_id: string,
};

export type UpdateAccountInput = {
  email?: string | null,
  sub: string,
  is_admin?: number | null,
  name?: string | null,
  tasks?: Array< AccountTaskInput > | null,
  username?: string | null,
};

export type DeleteAccountInput = {
  sub: string,
};

export type CreateReminderInput = {
  content: string,
  due_at: number,
  id?: string | null,
  task_id: string,
  reminderCreated_byId?: string | null,
};

export type ModelReminderConditionInput = {
  content?: ModelStringInput | null,
  due_at?: ModelIntInput | null,
  and?: Array< ModelReminderConditionInput | null > | null,
  or?: Array< ModelReminderConditionInput | null > | null,
  not?: ModelReminderConditionInput | null,
  reminderCreated_byId?: ModelIDInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type Reminder = {
  __typename: "Reminder",
  content: string,
  created_by?: Account | null,
  due_at: number,
  id: string,
  subscribers?: ModelAccountConnection | null,
  task_id: string,
  createdAt: string,
  updatedAt: string,
  reminderCreated_byId?: string | null,
  reminderCreated_bySub?: string | null,
};

export type ModelAccountConnection = {
  __typename: "ModelAccountConnection",
  items:  Array<Account | null >,
  nextToken?: string | null,
};

export type UpdateReminderInput = {
  content?: string | null,
  due_at?: number | null,
  id: string,
  task_id: string,
  reminderCreated_byId?: string | null,
};

export type DeleteReminderInput = {
  id: string,
  task_id: string,
};

export type CreateTaskInput = {
  completed_at?: number | null,
  description?: string | null,
  id?: string | null,
  subtasks: Array< SubtaskInput >,
  title: string,
  taskCreated_byId: string,
};

export type SubtaskInput = {
  description?: string | null,
  completed_at?: number | null,
  created_by_id: string,
  id: string,
  reminder_ids: Array< string >,
  subscriber_ids: Array< string >,
  title: string,
};

export type ModelTaskConditionInput = {
  completed_at?: ModelIntInput | null,
  description?: ModelStringInput | null,
  title?: ModelStringInput | null,
  and?: Array< ModelTaskConditionInput | null > | null,
  or?: Array< ModelTaskConditionInput | null > | null,
  not?: ModelTaskConditionInput | null,
  taskCreated_byId?: ModelIDInput | null,
};

export type Task = {
  __typename: "Task",
  completed_at?: number | null,
  created_by: Account,
  description?: string | null,
  id: string,
  reminders?: ModelReminderConnection | null,
  subtasks:  Array<Subtask >,
  title: string,
  createdAt: string,
  updatedAt: string,
  taskCreated_byId: string,
  taskCreated_bySub?: string | null,
};

export type ModelReminderConnection = {
  __typename: "ModelReminderConnection",
  items:  Array<Reminder | null >,
  nextToken?: string | null,
};

export type Subtask = {
  __typename: "Subtask",
  description?: string | null,
  completed_at?: number | null,
  created_by_id: string,
  id: string,
  reminder_ids: Array< string >,
  subscriber_ids: Array< string >,
  title: string,
};

export type UpdateTaskInput = {
  completed_at?: number | null,
  description?: string | null,
  id: string,
  subtasks?: Array< SubtaskInput > | null,
  title?: string | null,
  taskCreated_byId?: string | null,
};

export type DeleteTaskInput = {
  id: string,
};

export type ModelAccountFilterInput = {
  email?: ModelStringInput | null,
  sub?: ModelIDInput | null,
  is_admin?: ModelIntInput | null,
  name?: ModelStringInput | null,
  username?: ModelStringInput | null,
  and?: Array< ModelAccountFilterInput | null > | null,
  or?: Array< ModelAccountFilterInput | null > | null,
  not?: ModelAccountFilterInput | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelStringKeyConditionInput = {
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type ModelReminderFilterInput = {
  content?: ModelStringInput | null,
  due_at?: ModelIntInput | null,
  id?: ModelIDInput | null,
  task_id?: ModelStringInput | null,
  and?: Array< ModelReminderFilterInput | null > | null,
  or?: Array< ModelReminderFilterInput | null > | null,
  not?: ModelReminderFilterInput | null,
  reminderCreated_byId?: ModelIDInput | null,
};

export type ModelTaskFilterInput = {
  completed_at?: ModelIntInput | null,
  description?: ModelStringInput | null,
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  and?: Array< ModelTaskFilterInput | null > | null,
  or?: Array< ModelTaskFilterInput | null > | null,
  not?: ModelTaskFilterInput | null,
  taskCreated_byId?: ModelIDInput | null,
};

export type ModelTaskConnection = {
  __typename: "ModelTaskConnection",
  items:  Array<Task | null >,
  nextToken?: string | null,
};

export type ModelSubscriptionAccountFilterInput = {
  email?: ModelSubscriptionStringInput | null,
  is_admin?: ModelSubscriptionIntInput | null,
  name?: ModelSubscriptionStringInput | null,
  username?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionAccountFilterInput | null > | null,
  or?: Array< ModelSubscriptionAccountFilterInput | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionReminderFilterInput = {
  content?: ModelSubscriptionStringInput | null,
  due_at?: ModelSubscriptionIntInput | null,
  id?: ModelSubscriptionIDInput | null,
  task_id?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionReminderFilterInput | null > | null,
  or?: Array< ModelSubscriptionReminderFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionTaskFilterInput = {
  completed_at?: ModelSubscriptionIntInput | null,
  description?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  title?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionTaskFilterInput | null > | null,
  or?: Array< ModelSubscriptionTaskFilterInput | null > | null,
};

export type CreateAccountMutationVariables = {
  input: CreateAccountInput,
  condition?: ModelAccountConditionInput | null,
};

export type CreateAccountMutation = {
  createAccount?:  {
    __typename: "Account",
    email: string,
    sub: string,
    is_admin: number,
    name: string,
    tasks:  Array< {
      __typename: "AccountTask",
      permissions: number,
      position: number,
      reminder_ids: Array< string >,
      task_id: string,
    } >,
    username: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateAccountMutationVariables = {
  input: UpdateAccountInput,
  condition?: ModelAccountConditionInput | null,
};

export type UpdateAccountMutation = {
  updateAccount?:  {
    __typename: "Account",
    email: string,
    sub: string,
    is_admin: number,
    name: string,
    tasks:  Array< {
      __typename: "AccountTask",
      permissions: number,
      position: number,
      reminder_ids: Array< string >,
      task_id: string,
    } >,
    username: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteAccountMutationVariables = {
  input: DeleteAccountInput,
  condition?: ModelAccountConditionInput | null,
};

export type DeleteAccountMutation = {
  deleteAccount?:  {
    __typename: "Account",
    email: string,
    sub: string,
    is_admin: number,
    name: string,
    tasks:  Array< {
      __typename: "AccountTask",
      permissions: number,
      position: number,
      reminder_ids: Array< string >,
      task_id: string,
    } >,
    username: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateReminderMutationVariables = {
  input: CreateReminderInput,
  condition?: ModelReminderConditionInput | null,
};

export type CreateReminderMutation = {
  createReminder?:  {
    __typename: "Reminder",
    content: string,
    created_by?:  {
      __typename: "Account",
      email: string,
      sub: string,
      is_admin: number,
      name: string,
      tasks:  Array< {
        __typename: "AccountTask",
        permissions: number,
        position: number,
        reminder_ids: Array< string >,
        task_id: string,
      } >,
      username: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    due_at: number,
    id: string,
    subscribers?:  {
      __typename: "ModelAccountConnection",
      items:  Array< {
        __typename: "Account",
        email: string,
        sub: string,
        is_admin: number,
        name: string,
        tasks:  Array< {
          __typename: "AccountTask",
          permissions: number,
          position: number,
          reminder_ids: Array< string >,
          task_id: string,
        } >,
        username: string,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    task_id: string,
    createdAt: string,
    updatedAt: string,
    reminderCreated_byId?: string | null,
    reminderCreated_bySub?: string | null,
  } | null,
};

export type UpdateReminderMutationVariables = {
  input: UpdateReminderInput,
  condition?: ModelReminderConditionInput | null,
};

export type UpdateReminderMutation = {
  updateReminder?:  {
    __typename: "Reminder",
    content: string,
    created_by?:  {
      __typename: "Account",
      email: string,
      sub: string,
      is_admin: number,
      name: string,
      tasks:  Array< {
        __typename: "AccountTask",
        permissions: number,
        position: number,
        reminder_ids: Array< string >,
        task_id: string,
      } >,
      username: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    due_at: number,
    id: string,
    subscribers?:  {
      __typename: "ModelAccountConnection",
      items:  Array< {
        __typename: "Account",
        email: string,
        sub: string,
        is_admin: number,
        name: string,
        tasks:  Array< {
          __typename: "AccountTask",
          permissions: number,
          position: number,
          reminder_ids: Array< string >,
          task_id: string,
        } >,
        username: string,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    task_id: string,
    createdAt: string,
    updatedAt: string,
    reminderCreated_byId?: string | null,
    reminderCreated_bySub?: string | null,
  } | null,
};

export type DeleteReminderMutationVariables = {
  input: DeleteReminderInput,
  condition?: ModelReminderConditionInput | null,
};

export type DeleteReminderMutation = {
  deleteReminder?:  {
    __typename: "Reminder",
    content: string,
    created_by?:  {
      __typename: "Account",
      email: string,
      sub: string,
      is_admin: number,
      name: string,
      tasks:  Array< {
        __typename: "AccountTask",
        permissions: number,
        position: number,
        reminder_ids: Array< string >,
        task_id: string,
      } >,
      username: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    due_at: number,
    id: string,
    subscribers?:  {
      __typename: "ModelAccountConnection",
      items:  Array< {
        __typename: "Account",
        email: string,
        sub: string,
        is_admin: number,
        name: string,
        tasks:  Array< {
          __typename: "AccountTask",
          permissions: number,
          position: number,
          reminder_ids: Array< string >,
          task_id: string,
        } >,
        username: string,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    task_id: string,
    createdAt: string,
    updatedAt: string,
    reminderCreated_byId?: string | null,
    reminderCreated_bySub?: string | null,
  } | null,
};

export type CreateTaskMutationVariables = {
  input: CreateTaskInput,
  condition?: ModelTaskConditionInput | null,
};

export type CreateTaskMutation = {
  createTask?:  {
    __typename: "Task",
    completed_at?: number | null,
    created_by:  {
      __typename: "Account",
      email: string,
      sub: string,
      is_admin: number,
      name: string,
      tasks:  Array< {
        __typename: "AccountTask",
        permissions: number,
        position: number,
        reminder_ids: Array< string >,
        task_id: string,
      } >,
      username: string,
      createdAt: string,
      updatedAt: string,
    },
    description?: string | null,
    id: string,
    reminders?:  {
      __typename: "ModelReminderConnection",
      items:  Array< {
        __typename: "Reminder",
        content: string,
        created_by?:  {
          __typename: "Account",
          email: string,
          sub: string,
          is_admin: number,
          name: string,
          tasks:  Array< {
            __typename: "AccountTask",
            permissions: number,
            position: number,
            reminder_ids: Array< string >,
            task_id: string,
          } >,
          username: string,
          createdAt: string,
          updatedAt: string,
        } | null,
        due_at: number,
        id: string,
        subscribers?:  {
          __typename: "ModelAccountConnection",
          items:  Array< {
            __typename: "Account",
            email: string,
            sub: string,
            is_admin: number,
            name: string,
            tasks:  Array< {
              __typename: "AccountTask",
              permissions: number,
              position: number,
              reminder_ids: Array< string >,
              task_id: string,
            } >,
            username: string,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        task_id: string,
        createdAt: string,
        updatedAt: string,
        reminderCreated_byId?: string | null,
        reminderCreated_bySub?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    subtasks:  Array< {
      __typename: "Subtask",
      description?: string | null,
      completed_at?: number | null,
      created_by_id: string,
      id: string,
      reminder_ids: Array< string >,
      subscriber_ids: Array< string >,
      title: string,
    } >,
    title: string,
    createdAt: string,
    updatedAt: string,
    taskCreated_byId: string,
    taskCreated_bySub?: string | null,
  } | null,
};

export type UpdateTaskMutationVariables = {
  input: UpdateTaskInput,
  condition?: ModelTaskConditionInput | null,
};

export type UpdateTaskMutation = {
  updateTask?:  {
    __typename: "Task",
    completed_at?: number | null,
    created_by:  {
      __typename: "Account",
      email: string,
      sub: string,
      is_admin: number,
      name: string,
      tasks:  Array< {
        __typename: "AccountTask",
        permissions: number,
        position: number,
        reminder_ids: Array< string >,
        task_id: string,
      } >,
      username: string,
      createdAt: string,
      updatedAt: string,
    },
    description?: string | null,
    id: string,
    reminders?:  {
      __typename: "ModelReminderConnection",
      items:  Array< {
        __typename: "Reminder",
        content: string,
        created_by?:  {
          __typename: "Account",
          email: string,
          sub: string,
          is_admin: number,
          name: string,
          tasks:  Array< {
            __typename: "AccountTask",
            permissions: number,
            position: number,
            reminder_ids: Array< string >,
            task_id: string,
          } >,
          username: string,
          createdAt: string,
          updatedAt: string,
        } | null,
        due_at: number,
        id: string,
        subscribers?:  {
          __typename: "ModelAccountConnection",
          items:  Array< {
            __typename: "Account",
            email: string,
            sub: string,
            is_admin: number,
            name: string,
            tasks:  Array< {
              __typename: "AccountTask",
              permissions: number,
              position: number,
              reminder_ids: Array< string >,
              task_id: string,
            } >,
            username: string,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        task_id: string,
        createdAt: string,
        updatedAt: string,
        reminderCreated_byId?: string | null,
        reminderCreated_bySub?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    subtasks:  Array< {
      __typename: "Subtask",
      description?: string | null,
      completed_at?: number | null,
      created_by_id: string,
      id: string,
      reminder_ids: Array< string >,
      subscriber_ids: Array< string >,
      title: string,
    } >,
    title: string,
    createdAt: string,
    updatedAt: string,
    taskCreated_byId: string,
    taskCreated_bySub?: string | null,
  } | null,
};

export type DeleteTaskMutationVariables = {
  input: DeleteTaskInput,
  condition?: ModelTaskConditionInput | null,
};

export type DeleteTaskMutation = {
  deleteTask?:  {
    __typename: "Task",
    completed_at?: number | null,
    created_by:  {
      __typename: "Account",
      email: string,
      sub: string,
      is_admin: number,
      name: string,
      tasks:  Array< {
        __typename: "AccountTask",
        permissions: number,
        position: number,
        reminder_ids: Array< string >,
        task_id: string,
      } >,
      username: string,
      createdAt: string,
      updatedAt: string,
    },
    description?: string | null,
    id: string,
    reminders?:  {
      __typename: "ModelReminderConnection",
      items:  Array< {
        __typename: "Reminder",
        content: string,
        created_by?:  {
          __typename: "Account",
          email: string,
          sub: string,
          is_admin: number,
          name: string,
          tasks:  Array< {
            __typename: "AccountTask",
            permissions: number,
            position: number,
            reminder_ids: Array< string >,
            task_id: string,
          } >,
          username: string,
          createdAt: string,
          updatedAt: string,
        } | null,
        due_at: number,
        id: string,
        subscribers?:  {
          __typename: "ModelAccountConnection",
          items:  Array< {
            __typename: "Account",
            email: string,
            sub: string,
            is_admin: number,
            name: string,
            tasks:  Array< {
              __typename: "AccountTask",
              permissions: number,
              position: number,
              reminder_ids: Array< string >,
              task_id: string,
            } >,
            username: string,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        task_id: string,
        createdAt: string,
        updatedAt: string,
        reminderCreated_byId?: string | null,
        reminderCreated_bySub?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    subtasks:  Array< {
      __typename: "Subtask",
      description?: string | null,
      completed_at?: number | null,
      created_by_id: string,
      id: string,
      reminder_ids: Array< string >,
      subscriber_ids: Array< string >,
      title: string,
    } >,
    title: string,
    createdAt: string,
    updatedAt: string,
    taskCreated_byId: string,
    taskCreated_bySub?: string | null,
  } | null,
};

export type GetAccountQueryVariables = {
  sub: string,
};

export type GetAccountQuery = {
  getAccount?:  {
    __typename: "Account",
    email: string,
    sub: string,
    is_admin: number,
    name: string,
    tasks:  Array< {
      __typename: "AccountTask",
      permissions: number,
      position: number,
      reminder_ids: Array< string >,
      task_id: string,
    } >,
    username: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListAccountsQueryVariables = {
  sub?: string | null,
  filter?: ModelAccountFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListAccountsQuery = {
  listAccounts?:  {
    __typename: "ModelAccountConnection",
    items:  Array< {
      __typename: "Account",
      email: string,
      sub: string,
      is_admin: number,
      name: string,
      tasks:  Array< {
        __typename: "AccountTask",
        permissions: number,
        position: number,
        reminder_ids: Array< string >,
        task_id: string,
      } >,
      username: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetReminderQueryVariables = {
  id: string,
  task_id: string,
};

export type GetReminderQuery = {
  getReminder?:  {
    __typename: "Reminder",
    content: string,
    created_by?:  {
      __typename: "Account",
      email: string,
      sub: string,
      is_admin: number,
      name: string,
      tasks:  Array< {
        __typename: "AccountTask",
        permissions: number,
        position: number,
        reminder_ids: Array< string >,
        task_id: string,
      } >,
      username: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    due_at: number,
    id: string,
    subscribers?:  {
      __typename: "ModelAccountConnection",
      items:  Array< {
        __typename: "Account",
        email: string,
        sub: string,
        is_admin: number,
        name: string,
        tasks:  Array< {
          __typename: "AccountTask",
          permissions: number,
          position: number,
          reminder_ids: Array< string >,
          task_id: string,
        } >,
        username: string,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    task_id: string,
    createdAt: string,
    updatedAt: string,
    reminderCreated_byId?: string | null,
    reminderCreated_bySub?: string | null,
  } | null,
};

export type ListRemindersQueryVariables = {
  id?: string | null,
  task_id?: ModelStringKeyConditionInput | null,
  filter?: ModelReminderFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListRemindersQuery = {
  listReminders?:  {
    __typename: "ModelReminderConnection",
    items:  Array< {
      __typename: "Reminder",
      content: string,
      created_by?:  {
        __typename: "Account",
        email: string,
        sub: string,
        is_admin: number,
        name: string,
        tasks:  Array< {
          __typename: "AccountTask",
          permissions: number,
          position: number,
          reminder_ids: Array< string >,
          task_id: string,
        } >,
        username: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      due_at: number,
      id: string,
      subscribers?:  {
        __typename: "ModelAccountConnection",
        items:  Array< {
          __typename: "Account",
          email: string,
          sub: string,
          is_admin: number,
          name: string,
          tasks:  Array< {
            __typename: "AccountTask",
            permissions: number,
            position: number,
            reminder_ids: Array< string >,
            task_id: string,
          } >,
          username: string,
          createdAt: string,
          updatedAt: string,
        } | null >,
        nextToken?: string | null,
      } | null,
      task_id: string,
      createdAt: string,
      updatedAt: string,
      reminderCreated_byId?: string | null,
      reminderCreated_bySub?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetTaskQueryVariables = {
  id: string,
};

export type GetTaskQuery = {
  getTask?:  {
    __typename: "Task",
    completed_at?: number | null,
    created_by:  {
      __typename: "Account",
      email: string,
      sub: string,
      is_admin: number,
      name: string,
      tasks:  Array< {
        __typename: "AccountTask",
        permissions: number,
        position: number,
        reminder_ids: Array< string >,
        task_id: string,
      } >,
      username: string,
      createdAt: string,
      updatedAt: string,
    },
    description?: string | null,
    id: string,
    reminders?:  {
      __typename: "ModelReminderConnection",
      items:  Array< {
        __typename: "Reminder",
        content: string,
        created_by?:  {
          __typename: "Account",
          email: string,
          sub: string,
          is_admin: number,
          name: string,
          tasks:  Array< {
            __typename: "AccountTask",
            permissions: number,
            position: number,
            reminder_ids: Array< string >,
            task_id: string,
          } >,
          username: string,
          createdAt: string,
          updatedAt: string,
        } | null,
        due_at: number,
        id: string,
        subscribers?:  {
          __typename: "ModelAccountConnection",
          items:  Array< {
            __typename: "Account",
            email: string,
            sub: string,
            is_admin: number,
            name: string,
            tasks:  Array< {
              __typename: "AccountTask",
              permissions: number,
              position: number,
              reminder_ids: Array< string >,
              task_id: string,
            } >,
            username: string,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        task_id: string,
        createdAt: string,
        updatedAt: string,
        reminderCreated_byId?: string | null,
        reminderCreated_bySub?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    subtasks:  Array< {
      __typename: "Subtask",
      description?: string | null,
      completed_at?: number | null,
      created_by_id: string,
      id: string,
      reminder_ids: Array< string >,
      subscriber_ids: Array< string >,
      title: string,
    } >,
    title: string,
    createdAt: string,
    updatedAt: string,
    taskCreated_byId: string,
    taskCreated_bySub?: string | null,
  } | null,
};

export type ListTasksQueryVariables = {
  filter?: ModelTaskFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTasksQuery = {
  listTasks?:  {
    __typename: "ModelTaskConnection",
    items:  Array< {
      __typename: "Task",
      completed_at?: number | null,
      created_by:  {
        __typename: "Account",
        email: string,
        sub: string,
        is_admin: number,
        name: string,
        tasks:  Array< {
          __typename: "AccountTask",
          permissions: number,
          position: number,
          reminder_ids: Array< string >,
          task_id: string,
        } >,
        username: string,
        createdAt: string,
        updatedAt: string,
      },
      description?: string | null,
      id: string,
      reminders?:  {
        __typename: "ModelReminderConnection",
        items:  Array< {
          __typename: "Reminder",
          content: string,
          created_by?:  {
            __typename: "Account",
            email: string,
            sub: string,
            is_admin: number,
            name: string,
            tasks:  Array< {
              __typename: "AccountTask",
              permissions: number,
              position: number,
              reminder_ids: Array< string >,
              task_id: string,
            } >,
            username: string,
            createdAt: string,
            updatedAt: string,
          } | null,
          due_at: number,
          id: string,
          subscribers?:  {
            __typename: "ModelAccountConnection",
            items:  Array< {
              __typename: "Account",
              email: string,
              sub: string,
              is_admin: number,
              name: string,
              tasks:  Array< {
                __typename: "AccountTask",
                permissions: number,
                position: number,
                reminder_ids: Array< string >,
                task_id: string,
              } >,
              username: string,
              createdAt: string,
              updatedAt: string,
            } | null >,
            nextToken?: string | null,
          } | null,
          task_id: string,
          createdAt: string,
          updatedAt: string,
          reminderCreated_byId?: string | null,
          reminderCreated_bySub?: string | null,
        } | null >,
        nextToken?: string | null,
      } | null,
      subtasks:  Array< {
        __typename: "Subtask",
        description?: string | null,
        completed_at?: number | null,
        created_by_id: string,
        id: string,
        reminder_ids: Array< string >,
        subscriber_ids: Array< string >,
        title: string,
      } >,
      title: string,
      createdAt: string,
      updatedAt: string,
      taskCreated_byId: string,
      taskCreated_bySub?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateAccountSubscriptionVariables = {
  filter?: ModelSubscriptionAccountFilterInput | null,
  sub?: string | null,
};

export type OnCreateAccountSubscription = {
  onCreateAccount?:  {
    __typename: "Account",
    email: string,
    sub: string,
    is_admin: number,
    name: string,
    tasks:  Array< {
      __typename: "AccountTask",
      permissions: number,
      position: number,
      reminder_ids: Array< string >,
      task_id: string,
    } >,
    username: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateAccountSubscriptionVariables = {
  filter?: ModelSubscriptionAccountFilterInput | null,
  sub?: string | null,
};

export type OnUpdateAccountSubscription = {
  onUpdateAccount?:  {
    __typename: "Account",
    email: string,
    sub: string,
    is_admin: number,
    name: string,
    tasks:  Array< {
      __typename: "AccountTask",
      permissions: number,
      position: number,
      reminder_ids: Array< string >,
      task_id: string,
    } >,
    username: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteAccountSubscriptionVariables = {
  filter?: ModelSubscriptionAccountFilterInput | null,
  sub?: string | null,
};

export type OnDeleteAccountSubscription = {
  onDeleteAccount?:  {
    __typename: "Account",
    email: string,
    sub: string,
    is_admin: number,
    name: string,
    tasks:  Array< {
      __typename: "AccountTask",
      permissions: number,
      position: number,
      reminder_ids: Array< string >,
      task_id: string,
    } >,
    username: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateReminderSubscriptionVariables = {
  filter?: ModelSubscriptionReminderFilterInput | null,
  reminderCreated_bySub?: string | null,
};

export type OnCreateReminderSubscription = {
  onCreateReminder?:  {
    __typename: "Reminder",
    content: string,
    created_by?:  {
      __typename: "Account",
      email: string,
      sub: string,
      is_admin: number,
      name: string,
      tasks:  Array< {
        __typename: "AccountTask",
        permissions: number,
        position: number,
        reminder_ids: Array< string >,
        task_id: string,
      } >,
      username: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    due_at: number,
    id: string,
    subscribers?:  {
      __typename: "ModelAccountConnection",
      items:  Array< {
        __typename: "Account",
        email: string,
        sub: string,
        is_admin: number,
        name: string,
        tasks:  Array< {
          __typename: "AccountTask",
          permissions: number,
          position: number,
          reminder_ids: Array< string >,
          task_id: string,
        } >,
        username: string,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    task_id: string,
    createdAt: string,
    updatedAt: string,
    reminderCreated_byId?: string | null,
    reminderCreated_bySub?: string | null,
  } | null,
};

export type OnUpdateReminderSubscriptionVariables = {
  filter?: ModelSubscriptionReminderFilterInput | null,
  reminderCreated_bySub?: string | null,
};

export type OnUpdateReminderSubscription = {
  onUpdateReminder?:  {
    __typename: "Reminder",
    content: string,
    created_by?:  {
      __typename: "Account",
      email: string,
      sub: string,
      is_admin: number,
      name: string,
      tasks:  Array< {
        __typename: "AccountTask",
        permissions: number,
        position: number,
        reminder_ids: Array< string >,
        task_id: string,
      } >,
      username: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    due_at: number,
    id: string,
    subscribers?:  {
      __typename: "ModelAccountConnection",
      items:  Array< {
        __typename: "Account",
        email: string,
        sub: string,
        is_admin: number,
        name: string,
        tasks:  Array< {
          __typename: "AccountTask",
          permissions: number,
          position: number,
          reminder_ids: Array< string >,
          task_id: string,
        } >,
        username: string,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    task_id: string,
    createdAt: string,
    updatedAt: string,
    reminderCreated_byId?: string | null,
    reminderCreated_bySub?: string | null,
  } | null,
};

export type OnDeleteReminderSubscriptionVariables = {
  filter?: ModelSubscriptionReminderFilterInput | null,
  reminderCreated_bySub?: string | null,
};

export type OnDeleteReminderSubscription = {
  onDeleteReminder?:  {
    __typename: "Reminder",
    content: string,
    created_by?:  {
      __typename: "Account",
      email: string,
      sub: string,
      is_admin: number,
      name: string,
      tasks:  Array< {
        __typename: "AccountTask",
        permissions: number,
        position: number,
        reminder_ids: Array< string >,
        task_id: string,
      } >,
      username: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    due_at: number,
    id: string,
    subscribers?:  {
      __typename: "ModelAccountConnection",
      items:  Array< {
        __typename: "Account",
        email: string,
        sub: string,
        is_admin: number,
        name: string,
        tasks:  Array< {
          __typename: "AccountTask",
          permissions: number,
          position: number,
          reminder_ids: Array< string >,
          task_id: string,
        } >,
        username: string,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    task_id: string,
    createdAt: string,
    updatedAt: string,
    reminderCreated_byId?: string | null,
    reminderCreated_bySub?: string | null,
  } | null,
};

export type OnCreateTaskSubscriptionVariables = {
  filter?: ModelSubscriptionTaskFilterInput | null,
  taskCreated_bySub?: string | null,
};

export type OnCreateTaskSubscription = {
  onCreateTask?:  {
    __typename: "Task",
    completed_at?: number | null,
    created_by:  {
      __typename: "Account",
      email: string,
      sub: string,
      is_admin: number,
      name: string,
      tasks:  Array< {
        __typename: "AccountTask",
        permissions: number,
        position: number,
        reminder_ids: Array< string >,
        task_id: string,
      } >,
      username: string,
      createdAt: string,
      updatedAt: string,
    },
    description?: string | null,
    id: string,
    reminders?:  {
      __typename: "ModelReminderConnection",
      items:  Array< {
        __typename: "Reminder",
        content: string,
        created_by?:  {
          __typename: "Account",
          email: string,
          sub: string,
          is_admin: number,
          name: string,
          tasks:  Array< {
            __typename: "AccountTask",
            permissions: number,
            position: number,
            reminder_ids: Array< string >,
            task_id: string,
          } >,
          username: string,
          createdAt: string,
          updatedAt: string,
        } | null,
        due_at: number,
        id: string,
        subscribers?:  {
          __typename: "ModelAccountConnection",
          items:  Array< {
            __typename: "Account",
            email: string,
            sub: string,
            is_admin: number,
            name: string,
            tasks:  Array< {
              __typename: "AccountTask",
              permissions: number,
              position: number,
              reminder_ids: Array< string >,
              task_id: string,
            } >,
            username: string,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        task_id: string,
        createdAt: string,
        updatedAt: string,
        reminderCreated_byId?: string | null,
        reminderCreated_bySub?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    subtasks:  Array< {
      __typename: "Subtask",
      description?: string | null,
      completed_at?: number | null,
      created_by_id: string,
      id: string,
      reminder_ids: Array< string >,
      subscriber_ids: Array< string >,
      title: string,
    } >,
    title: string,
    createdAt: string,
    updatedAt: string,
    taskCreated_byId: string,
    taskCreated_bySub?: string | null,
  } | null,
};

export type OnUpdateTaskSubscriptionVariables = {
  filter?: ModelSubscriptionTaskFilterInput | null,
  taskCreated_bySub?: string | null,
};

export type OnUpdateTaskSubscription = {
  onUpdateTask?:  {
    __typename: "Task",
    completed_at?: number | null,
    created_by:  {
      __typename: "Account",
      email: string,
      sub: string,
      is_admin: number,
      name: string,
      tasks:  Array< {
        __typename: "AccountTask",
        permissions: number,
        position: number,
        reminder_ids: Array< string >,
        task_id: string,
      } >,
      username: string,
      createdAt: string,
      updatedAt: string,
    },
    description?: string | null,
    id: string,
    reminders?:  {
      __typename: "ModelReminderConnection",
      items:  Array< {
        __typename: "Reminder",
        content: string,
        created_by?:  {
          __typename: "Account",
          email: string,
          sub: string,
          is_admin: number,
          name: string,
          tasks:  Array< {
            __typename: "AccountTask",
            permissions: number,
            position: number,
            reminder_ids: Array< string >,
            task_id: string,
          } >,
          username: string,
          createdAt: string,
          updatedAt: string,
        } | null,
        due_at: number,
        id: string,
        subscribers?:  {
          __typename: "ModelAccountConnection",
          items:  Array< {
            __typename: "Account",
            email: string,
            sub: string,
            is_admin: number,
            name: string,
            tasks:  Array< {
              __typename: "AccountTask",
              permissions: number,
              position: number,
              reminder_ids: Array< string >,
              task_id: string,
            } >,
            username: string,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        task_id: string,
        createdAt: string,
        updatedAt: string,
        reminderCreated_byId?: string | null,
        reminderCreated_bySub?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    subtasks:  Array< {
      __typename: "Subtask",
      description?: string | null,
      completed_at?: number | null,
      created_by_id: string,
      id: string,
      reminder_ids: Array< string >,
      subscriber_ids: Array< string >,
      title: string,
    } >,
    title: string,
    createdAt: string,
    updatedAt: string,
    taskCreated_byId: string,
    taskCreated_bySub?: string | null,
  } | null,
};

export type OnDeleteTaskSubscriptionVariables = {
  filter?: ModelSubscriptionTaskFilterInput | null,
  taskCreated_bySub?: string | null,
};

export type OnDeleteTaskSubscription = {
  onDeleteTask?:  {
    __typename: "Task",
    completed_at?: number | null,
    created_by:  {
      __typename: "Account",
      email: string,
      sub: string,
      is_admin: number,
      name: string,
      tasks:  Array< {
        __typename: "AccountTask",
        permissions: number,
        position: number,
        reminder_ids: Array< string >,
        task_id: string,
      } >,
      username: string,
      createdAt: string,
      updatedAt: string,
    },
    description?: string | null,
    id: string,
    reminders?:  {
      __typename: "ModelReminderConnection",
      items:  Array< {
        __typename: "Reminder",
        content: string,
        created_by?:  {
          __typename: "Account",
          email: string,
          sub: string,
          is_admin: number,
          name: string,
          tasks:  Array< {
            __typename: "AccountTask",
            permissions: number,
            position: number,
            reminder_ids: Array< string >,
            task_id: string,
          } >,
          username: string,
          createdAt: string,
          updatedAt: string,
        } | null,
        due_at: number,
        id: string,
        subscribers?:  {
          __typename: "ModelAccountConnection",
          items:  Array< {
            __typename: "Account",
            email: string,
            sub: string,
            is_admin: number,
            name: string,
            tasks:  Array< {
              __typename: "AccountTask",
              permissions: number,
              position: number,
              reminder_ids: Array< string >,
              task_id: string,
            } >,
            username: string,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        task_id: string,
        createdAt: string,
        updatedAt: string,
        reminderCreated_byId?: string | null,
        reminderCreated_bySub?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    subtasks:  Array< {
      __typename: "Subtask",
      description?: string | null,
      completed_at?: number | null,
      created_by_id: string,
      id: string,
      reminder_ids: Array< string >,
      subscriber_ids: Array< string >,
      title: string,
    } >,
    title: string,
    createdAt: string,
    updatedAt: string,
    taskCreated_byId: string,
    taskCreated_bySub?: string | null,
  } | null,
};
