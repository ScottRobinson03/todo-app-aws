/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateAccount = /* GraphQL */ `
  subscription OnCreateAccount(
    $filter: ModelSubscriptionAccountFilterInput
    $sub: String
  ) {
    onCreateAccount(filter: $filter, sub: $sub) {
      email
      sub
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
    $sub: String
  ) {
    onUpdateAccount(filter: $filter, sub: $sub) {
      email
      sub
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
    $sub: String
  ) {
    onDeleteAccount(filter: $filter, sub: $sub) {
      email
      sub
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
    $reminderCreated_bySub: String
  ) {
    onCreateReminder(
      filter: $filter
      reminderCreated_bySub: $reminderCreated_bySub
    ) {
      content
      created_by {
        email
        sub
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
      due_at
      id
      subscribers {
        items {
          email
          sub
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
        nextToken
      }
      task_id
      createdAt
      updatedAt
      reminderCreated_bySub
    }
  }
`;
export const onUpdateReminder = /* GraphQL */ `
  subscription OnUpdateReminder(
    $filter: ModelSubscriptionReminderFilterInput
    $reminderCreated_bySub: String
  ) {
    onUpdateReminder(
      filter: $filter
      reminderCreated_bySub: $reminderCreated_bySub
    ) {
      content
      created_by {
        email
        sub
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
      due_at
      id
      subscribers {
        items {
          email
          sub
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
        nextToken
      }
      task_id
      createdAt
      updatedAt
      reminderCreated_bySub
    }
  }
`;
export const onDeleteReminder = /* GraphQL */ `
  subscription OnDeleteReminder(
    $filter: ModelSubscriptionReminderFilterInput
    $reminderCreated_bySub: String
  ) {
    onDeleteReminder(
      filter: $filter
      reminderCreated_bySub: $reminderCreated_bySub
    ) {
      content
      created_by {
        email
        sub
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
      due_at
      id
      subscribers {
        items {
          email
          sub
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
        nextToken
      }
      task_id
      createdAt
      updatedAt
      reminderCreated_bySub
    }
  }
`;
export const onCreateTask = /* GraphQL */ `
  subscription OnCreateTask(
    $filter: ModelSubscriptionTaskFilterInput
    $taskCreated_bySub: String
  ) {
    onCreateTask(filter: $filter, taskCreated_bySub: $taskCreated_bySub) {
      completed_at
      created_by {
        email
        sub
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
      description
      id
      reminders {
        items {
          content
          created_by {
            email
            sub
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
          due_at
          id
          subscribers {
            items {
              email
              sub
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
            nextToken
          }
          task_id
          createdAt
          updatedAt
          reminderCreated_bySub
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
      taskCreated_bySub
    }
  }
`;
export const onUpdateTask = /* GraphQL */ `
  subscription OnUpdateTask(
    $filter: ModelSubscriptionTaskFilterInput
    $taskCreated_bySub: String
  ) {
    onUpdateTask(filter: $filter, taskCreated_bySub: $taskCreated_bySub) {
      completed_at
      created_by {
        email
        sub
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
      description
      id
      reminders {
        items {
          content
          created_by {
            email
            sub
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
          due_at
          id
          subscribers {
            items {
              email
              sub
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
            nextToken
          }
          task_id
          createdAt
          updatedAt
          reminderCreated_bySub
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
      taskCreated_bySub
    }
  }
`;
export const onDeleteTask = /* GraphQL */ `
  subscription OnDeleteTask(
    $filter: ModelSubscriptionTaskFilterInput
    $taskCreated_bySub: String
  ) {
    onDeleteTask(filter: $filter, taskCreated_bySub: $taskCreated_bySub) {
      completed_at
      created_by {
        email
        sub
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
      description
      id
      reminders {
        items {
          content
          created_by {
            email
            sub
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
          due_at
          id
          subscribers {
            items {
              email
              sub
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
            nextToken
          }
          task_id
          createdAt
          updatedAt
          reminderCreated_bySub
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
      taskCreated_bySub
    }
  }
`;
