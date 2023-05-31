import {
    CreateAccountMutation,
    CreateAccountMutationVariables,
    CreateTaskMutation,
    CreateTaskMutationVariables,
    ListAccountsQuery,
    ListAccountsQueryVariables,
    ListTasksQuery,
    ListTasksQueryVariables,
    UpdateAccountMutation,
    UpdateAccountMutationVariables,
} from "../API";
import { createAccount, createTask, updateAccount } from "../graphql/mutations";
import { listAccounts, listTasks } from "../graphql/queries";

export type GraphQLMutations = {
    [createAccount]: {
        response: CreateAccountMutation;
        variables: CreateAccountMutationVariables;
    };
    [createTask]: {
        response: CreateTaskMutation;
        variables: CreateTaskMutationVariables;
    };
    [updateAccount]: {
        response: UpdateAccountMutation;
        variables: UpdateAccountMutationVariables;
    };
};

export type GraphQLQueries = {
    [listAccounts]: {
        response: ListAccountsQuery;
        variables: ListAccountsQueryVariables;
    };
    [listTasks]: {
        response: ListTasksQuery;
        variables: ListTasksQueryVariables;
    };
};

export type GraphQLOperations = GraphQLQueries & GraphQLMutations;
