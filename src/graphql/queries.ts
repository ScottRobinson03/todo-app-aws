/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAccount = /* GraphQL */ `
  query GetAccount($sub: ID!) {
    getAccount(sub: $sub) {
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
export const listAccounts = /* GraphQL */ `
  query ListAccounts(
    $sub: ID
    $filter: ModelAccountFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listAccounts(
      sub: $sub
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
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
  }
`;
export const getReminder = /* GraphQL */ `
  query GetReminder($id: ID!, $task_id: String!) {
    getReminder(id: $id, task_id: $task_id) {
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
      reminderCreated_byId
      reminderCreated_bySub
    }
  }
`;
export const listReminders = /* GraphQL */ `
  query ListReminders(
    $id: ID
    $task_id: ModelStringKeyConditionInput
    $filter: ModelReminderFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listReminders(
      id: $id
      task_id: $task_id
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
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
        reminderCreated_byId
        reminderCreated_bySub
      }
      nextToken
    }
  }
`;
export const getTask = /* GraphQL */ `
  query GetTask($id: ID!) {
    getTask(id: $id) {
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
          reminderCreated_byId
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
      taskCreated_byId
      taskCreated_bySub
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
            reminderCreated_byId
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
        taskCreated_byId
        taskCreated_bySub
      }
      nextToken
    }
  }
`;
