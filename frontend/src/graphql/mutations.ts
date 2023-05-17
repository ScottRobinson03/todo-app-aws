/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createAccount = /* GraphQL */ `
  mutation CreateAccount(
    $input: CreateAccountInput!
    $condition: ModelAccountConditionInput
  ) {
    createAccount(input: $input, condition: $condition) {
      email
      hash
      id
      is_admin
      name
      tasks {
        permissions
        position
        reminder_ids
        task_id
      }
      username
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updateAccount = /* GraphQL */ `
  mutation UpdateAccount(
    $input: UpdateAccountInput!
    $condition: ModelAccountConditionInput
  ) {
    updateAccount(input: $input, condition: $condition) {
      email
      hash
      id
      is_admin
      name
      tasks {
        permissions
        position
        reminder_ids
        task_id
      }
      username
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deleteAccount = /* GraphQL */ `
  mutation DeleteAccount(
    $input: DeleteAccountInput!
    $condition: ModelAccountConditionInput
  ) {
    deleteAccount(input: $input, condition: $condition) {
      email
      hash
      id
      is_admin
      name
      tasks {
        permissions
        position
        reminder_ids
        task_id
      }
      username
      createdAt
      updatedAt
      owner
    }
  }
`;
export const createReminder = /* GraphQL */ `
  mutation CreateReminder(
    $input: CreateReminderInput!
    $condition: ModelReminderConditionInput
  ) {
    createReminder(input: $input, condition: $condition) {
      content
      created_by
      due_at
      id
      subscriber_ids
      subscribers {
        items {
          email
          hash
          id
          is_admin
          name
          username
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      task_id
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updateReminder = /* GraphQL */ `
  mutation UpdateReminder(
    $input: UpdateReminderInput!
    $condition: ModelReminderConditionInput
  ) {
    updateReminder(input: $input, condition: $condition) {
      content
      created_by
      due_at
      id
      subscriber_ids
      subscribers {
        items {
          email
          hash
          id
          is_admin
          name
          username
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      task_id
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deleteReminder = /* GraphQL */ `
  mutation DeleteReminder(
    $input: DeleteReminderInput!
    $condition: ModelReminderConditionInput
  ) {
    deleteReminder(input: $input, condition: $condition) {
      content
      created_by
      due_at
      id
      subscriber_ids
      subscribers {
        items {
          email
          hash
          id
          is_admin
          name
          username
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      task_id
      createdAt
      updatedAt
      owner
    }
  }
`;
export const createTask = /* GraphQL */ `
  mutation CreateTask(
    $input: CreateTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    createTask(input: $input, condition: $condition) {
      completed_at
      created_by_id
      created_by {
        email
        hash
        id
        is_admin
        name
        tasks {
          permissions
          position
          reminder_ids
          task_id
        }
        username
        createdAt
        updatedAt
        owner
      }
      description
      id
      reminder_ids
      reminders {
        items {
          content
          created_by
          due_at
          id
          subscriber_ids
          task_id
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      subtasks {
        description
        completed_at
        created_by_id
        id
        reminder_ids
        subscriber_ids
        title
      }
      title
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updateTask = /* GraphQL */ `
  mutation UpdateTask(
    $input: UpdateTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    updateTask(input: $input, condition: $condition) {
      completed_at
      created_by_id
      created_by {
        email
        hash
        id
        is_admin
        name
        tasks {
          permissions
          position
          reminder_ids
          task_id
        }
        username
        createdAt
        updatedAt
        owner
      }
      description
      id
      reminder_ids
      reminders {
        items {
          content
          created_by
          due_at
          id
          subscriber_ids
          task_id
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      subtasks {
        description
        completed_at
        created_by_id
        id
        reminder_ids
        subscriber_ids
        title
      }
      title
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deleteTask = /* GraphQL */ `
  mutation DeleteTask(
    $input: DeleteTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    deleteTask(input: $input, condition: $condition) {
      completed_at
      created_by_id
      created_by {
        email
        hash
        id
        is_admin
        name
        tasks {
          permissions
          position
          reminder_ids
          task_id
        }
        username
        createdAt
        updatedAt
        owner
      }
      description
      id
      reminder_ids
      reminders {
        items {
          content
          created_by
          due_at
          id
          subscriber_ids
          task_id
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      subtasks {
        description
        completed_at
        created_by_id
        id
        reminder_ids
        subscriber_ids
        title
      }
      title
      createdAt
      updatedAt
      owner
    }
  }
`;
