/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAccount = /* GraphQL */ `
  query GetAccount($id: ID!) {
    getAccount(id: $id) {
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
export const listAccounts = /* GraphQL */ `
  query ListAccounts(
    $filter: ModelAccountFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAccounts(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
  }
`;
export const getReminder = /* GraphQL */ `
  query GetReminder($id: ID!) {
    getReminder(id: $id) {
      content
      created_by
      due_at
      id
      subscriber_ids
      subscribers {
        nextToken
      }
      task_id
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listReminders = /* GraphQL */ `
  query ListReminders(
    $filter: ModelReminderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listReminders(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
  }
`;
export const getTask = /* GraphQL */ `
  query GetTask($id: ID!) {
    getTask(id: $id) {
      completed_at
      created_by_id
      created_by {
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
      description
      id
      reminder_ids
      reminders {
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
export const listTasks = /* GraphQL */ `
  query ListTasks(
    $filter: ModelTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTasks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        completed_at
        created_by_id
        description
        id
        reminder_ids
        title
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
