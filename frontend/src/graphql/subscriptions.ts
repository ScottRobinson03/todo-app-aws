/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateAccount = /* GraphQL */ `
  subscription OnCreateAccount(
    $filter: ModelSubscriptionAccountFilterInput
    $id: String
  ) {
    onCreateAccount(filter: $filter, id: $id) {
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
    }
  }
`;
export const onUpdateAccount = /* GraphQL */ `
  subscription OnUpdateAccount(
    $filter: ModelSubscriptionAccountFilterInput
    $id: String
  ) {
    onUpdateAccount(filter: $filter, id: $id) {
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
    }
  }
`;
export const onDeleteAccount = /* GraphQL */ `
  subscription OnDeleteAccount(
    $filter: ModelSubscriptionAccountFilterInput
    $id: String
  ) {
    onDeleteAccount(filter: $filter, id: $id) {
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
    }
  }
`;
export const onCreateReminder = /* GraphQL */ `
  subscription OnCreateReminder(
    $filter: ModelSubscriptionReminderFilterInput
    $created_by_id: String
  ) {
    onCreateReminder(filter: $filter, created_by_id: $created_by_id) {
      content
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
      }
      due_at
      id
      subscriber_ids
      subscribers {
        nextToken
      }
      task_id
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateReminder = /* GraphQL */ `
  subscription OnUpdateReminder(
    $filter: ModelSubscriptionReminderFilterInput
    $created_by_id: String
  ) {
    onUpdateReminder(filter: $filter, created_by_id: $created_by_id) {
      content
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
      }
      due_at
      id
      subscriber_ids
      subscribers {
        nextToken
      }
      task_id
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteReminder = /* GraphQL */ `
  subscription OnDeleteReminder(
    $filter: ModelSubscriptionReminderFilterInput
    $created_by_id: String
  ) {
    onDeleteReminder(filter: $filter, created_by_id: $created_by_id) {
      content
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
      }
      due_at
      id
      subscriber_ids
      subscribers {
        nextToken
      }
      task_id
      createdAt
      updatedAt
    }
  }
`;
export const onCreateTask = /* GraphQL */ `
  subscription OnCreateTask(
    $filter: ModelSubscriptionTaskFilterInput
    $created_by_id: String
  ) {
    onCreateTask(filter: $filter, created_by_id: $created_by_id) {
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
    }
  }
`;
export const onUpdateTask = /* GraphQL */ `
  subscription OnUpdateTask(
    $filter: ModelSubscriptionTaskFilterInput
    $created_by_id: String
  ) {
    onUpdateTask(filter: $filter, created_by_id: $created_by_id) {
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
    }
  }
`;
export const onDeleteTask = /* GraphQL */ `
  subscription OnDeleteTask(
    $filter: ModelSubscriptionTaskFilterInput
    $created_by_id: String
  ) {
    onDeleteTask(filter: $filter, created_by_id: $created_by_id) {
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
    }
  }
`;
