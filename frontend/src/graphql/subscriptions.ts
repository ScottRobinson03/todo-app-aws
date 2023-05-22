/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateAccount = /* GraphQL */ `
  subscription OnCreateAccount(
    $filter: ModelSubscriptionAccountFilterInput
    $owner: String
  ) {
    onCreateAccount(filter: $filter, owner: $owner) {
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
export const onUpdateAccount = /* GraphQL */ `
  subscription OnUpdateAccount(
    $filter: ModelSubscriptionAccountFilterInput
    $owner: String
  ) {
    onUpdateAccount(filter: $filter, owner: $owner) {
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
export const onDeleteAccount = /* GraphQL */ `
  subscription OnDeleteAccount(
    $filter: ModelSubscriptionAccountFilterInput
    $owner: String
  ) {
    onDeleteAccount(filter: $filter, owner: $owner) {
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
export const onCreateReminder = /* GraphQL */ `
  subscription OnCreateReminder(
    $filter: ModelSubscriptionReminderFilterInput
    $owner: String
  ) {
    onCreateReminder(filter: $filter, owner: $owner) {
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
export const onUpdateReminder = /* GraphQL */ `
  subscription OnUpdateReminder(
    $filter: ModelSubscriptionReminderFilterInput
    $owner: String
  ) {
    onUpdateReminder(filter: $filter, owner: $owner) {
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
export const onDeleteReminder = /* GraphQL */ `
  subscription OnDeleteReminder(
    $filter: ModelSubscriptionReminderFilterInput
    $owner: String
  ) {
    onDeleteReminder(filter: $filter, owner: $owner) {
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
export const onCreateTask = /* GraphQL */ `
  subscription OnCreateTask(
    $filter: ModelSubscriptionTaskFilterInput
    $owner: String
  ) {
    onCreateTask(filter: $filter, owner: $owner) {
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
export const onUpdateTask = /* GraphQL */ `
  subscription OnUpdateTask(
    $filter: ModelSubscriptionTaskFilterInput
    $owner: String
  ) {
    onUpdateTask(filter: $filter, owner: $owner) {
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
export const onDeleteTask = /* GraphQL */ `
  subscription OnDeleteTask(
    $filter: ModelSubscriptionTaskFilterInput
    $owner: String
  ) {
    onDeleteTask(filter: $filter, owner: $owner) {
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
