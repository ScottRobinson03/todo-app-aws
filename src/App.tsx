import { Button } from "@mui/material";
import TaskView from "./components/TaskView";

import uuid4 from "uuid4";
import { useEffect, useState } from "react";
import { AmplifyUser, AuthEventData } from "@aws-amplify/ui";
import {
    Account as GraphQLAccount,
    CreateAccountInput,
    CreateAccountMutationVariables,
    CreateTaskMutationVariables,
    Task as GraphQLTask,
    ListAccountsQueryVariables,
    ListTasksQueryVariables,
    AccountTask,
    UpdateAccountMutationVariables,
    UpdateAccountInput,
} from "./API";
import {
    createAccount as createAccountMutation,
    createTask as createTaskMutation,
    updateAccount as updateAccountMutation,
} from "./graphql/mutations";
import { listAccounts as listAccountsQuery, listTasks as listTasksQuery } from "./graphql/queries";
import {
    ensureExactKeys,
    executeGraphQLOperation,
    isDeeplyEqual,
    isKeyOf,
    removeTypenameFromObject,
    removeValuesFromArray,
    userTaskToAccountTask,
} from "./utils";

type CognitoUser = Omit<CreateAccountInput, "is_admin" | "tasks"> & { sub: string };

interface AppProps {
    signOut: ((data?: AuthEventData | undefined) => void) | undefined;
    user: AmplifyUser | undefined;
}

export default function App(props: AppProps) {
    const { signOut, user } = props;

    const [account, setAccount] = useState<GraphQLAccount | undefined>(undefined);
    const [tasks, setTasks] = useState<GraphQLTask[]>([]);
    const [tasksOfAccount, setTasksOfAccount] = useState<AccountTask[]>([]);

    useEffect(() => {
        if (!user) return;

        // Ensure signed in user has an account
        fetchAccounts().then(accounts => {
            getBasicUserInfo(user).then(userInfo => {
                // See if user already has an account
                let userHasAccount = false;

                for (const account of accounts) {
                    if (account.sub === userInfo.sub) {
                        userHasAccount = true;
                        setTasksOfAccount(account.tasks);
                        setAccount(account);
                        break;
                    }
                }
                // If they don't, create one
                if (!userHasAccount) {
                    createAccount({ ...userInfo, tasks: [], is_admin: 0 }).then(createdAccount => {
                        console.log(
                            `Created website account for cognito user ${
                                userInfo.sub
                            }: ${JSON.stringify(createdAccount, null, 2)}`
                        );
                        if (createdAccount.data?.createAccount)
                            setAccount(createdAccount.data?.createAccount);
                    });
                }
            });
        });
    }, [user]);

    useEffect(() => {
        if (!account) return;

        console.log(`User ${account.sub} already has an account`);
        // Fetch all tasks the signed in user can see
        // TODO: Edit logic so there's no need for duplication within if & else branch to preserve order of execution
        fetchTasks().then(tasksOfUser => {
            console.log(`tasksOfUser: ${JSON.stringify(tasksOfUser, null, 2)}`);
            setTasks(tasksOfUser);

            // NB: This code assumes it's not possible for a task to be in the account (Account table) but not the user (Task table)
            if (tasksOfAccount.length < tasksOfUser.length) {
                // The tasks of the account isn't up-to-date with the tasks table

                const tasksOfUserIdMapping: Record<GraphQLTask["id"], GraphQLTask> =
                    tasksOfUser.reduce((accumulated, userTask) => {
                        return { ...accumulated, [userTask.id]: userTask };
                    }, {});

                const tasksOfAccountIdMapping: Record<
                    AccountTask["task_id"],
                    Omit<AccountTask, "__typename">
                > = tasksOfAccount.reduce((accumulated, accountTask) => {
                    const { __typename, ...accountTaskWithoutTypename } = accountTask;
                    return {
                        ...accumulated,
                        [accountTask.task_id]: accountTaskWithoutTypename,
                    };
                }, {});

                for (const userTaskId of Object.keys(tasksOfUserIdMapping)) {
                    if (!isKeyOf(userTaskId, tasksOfAccountIdMapping)) {
                        // Task is in the task database but not the account database
                        const userTaskAsAccountTask = userTaskToAccountTask(
                            tasksOfUserIdMapping[userTaskId],
                            {
                                // TODO: Change to utilise permissions enum
                                permissions: 1, // admin perms
                            }
                        );
                        // FIXME: Address the __typename (shouldn't be part of the UPDATE call)
                        // probably fix inside of updateAccount itself(?) or otherwise don't include __typename in the array
                        tasksOfAccount.push(userTaskAsAccountTask);
                    }
                }
                // TODO: Update account in database (WIP)
                console.log(
                    `Tasks of account (initialised): ${JSON.stringify(tasksOfAccount, null, 2)}`
                );
                updateAccount({
                    sub: account.sub,
                    tasks: tasksOfAccount.map(removeTypenameFromObject),
                });
            } else {
                console.log("Account's tasks are up-to-date with the tasks table.");
            }
            // addTask().then(() => console.log("Created Task"));
        });
    }, [account]);

    if (signOut === undefined && user === undefined) {
        return <p>'signOut' and 'user' props are both undefined</p>;
    } else if (signOut === undefined) {
        return <p>'signOut' prop is undefined and user is ${user?.getUsername()}</p>;
    } else if (user === undefined) {
        return <p>'user' is undefined</p>;
    }

    async function getBasicUserInfo(user: AmplifyUser | undefined) {
        if (user === undefined) throw new Error("Attempted to fetch info of an undefined user");

        return new Promise((resolve, reject) => {
            user.getUserData((err, data) => {
                if (err) {
                    reject(JSON.stringify(err));
                    return;
                }

                if (data === undefined) {
                    reject(`Failed to fetch user data (was undefined)`);
                    return;
                }

                // Specify attributes to be set
                const userData: { [key in keyof CognitoUser]: CognitoUser[key] | undefined } = {
                    sub: undefined,
                    email: undefined,
                    name: undefined,
                    username: undefined,
                };
                userData.username = data.Username;
                // Attempt to set each attribute
                for (const userAttribute of data.UserAttributes) {
                    if (Object.keys(userData).includes(userAttribute.Name)) {
                        (userData as any)[userAttribute.Name] = userAttribute.Value;
                    }
                }

                // Ensure each attribute has been set
                for (const [k, v] of Object.entries(userData)) {
                    if (v === undefined) {
                        reject(
                            `Failed to get ${k} of user${user.username ? ` ${user.username}` : ""}`
                        );
                    }
                }

                resolve(userData as CognitoUser);
            });
        }) as Promise<CognitoUser>;
    }

    async function createAccount(details: CreateAccountInput, validateIdInPool: boolean = true) {
        // TODO: Ensure there isn't already an account with the id (*appears* to be done automatically)

        if (validateIdInPool) {
            // TODO: Lookup id to ensure it matches a user in the cognito pool
        }

        const variables: CreateAccountMutationVariables = { input: details };
        console.log(`Create Account: ${JSON.stringify(variables, null, 2)}`);
        return executeGraphQLOperation(createAccountMutation, variables);
    }

    async function fetchAccounts(variables: ListAccountsQueryVariables = {}) {
        const response = await executeGraphQLOperation(listAccountsQuery, variables);
        if (response.errors)
            throw new Error(
                `Got unexpected error(s) when fetching tasks: ${JSON.stringify(
                    response.errors,
                    null,
                    2
                )}`
            );

        const accounts = response.data?.listAccounts?.items;
        if (!accounts)
            throw new Error(
                `Received falsey value for accounts from response ${JSON.stringify(
                    response,
                    null,
                    2
                )}`
            );

        // NB: Could be an empty array as that's not falsey in JS/TS
        const filteredAccounts = removeValuesFromArray(accounts, [null]);
        return filteredAccounts;
    }

    async function updateAccount(input: UpdateAccountInput) {
        const exactInput = ensureExactKeys(input, [
            "email?",
            "sub",
            "is_admin?",
            "name?",
            "tasks?",
            "username?",
        ]);

        const variables: UpdateAccountMutationVariables = { input: exactInput };
        console.log(`updateAccount Variables: ${JSON.stringify(variables, null, 2)}`);
        await executeGraphQLOperation(updateAccountMutation, variables);

        if (exactInput.tasks) {
            const exactInputWithTypename = exactInput.tasks.map(task => {
                return { ...task, __typename: "AccountTask" };
            }) as AccountTask[];

            if (!isDeeplyEqual(exactInputWithTypename, tasksOfAccount)) {
                console.log(
                    "input.tasks of updateAccount doesn't match tasksOfAccount so updating it"
                );
                setTasksOfAccount(exactInputWithTypename);
            } else {
                console.log(
                    "input.tasks of updateAccount already matches tasksOfAccount so not updating it"
                );
            }
        }
    }

    async function addTask() {
        if (!account) throw new Error(`Attempted to create a task without an account set in state`);

        console.log(`Creating a task for account '${account.sub}'`);

        // TODO: Validate task

        const createTaskMutationVariables: CreateTaskMutationVariables = {
            input: {
                taskCreated_bySub: account.sub,
                id: uuid4(),
                // TODO: Figure out why we can't specify reminder ids. Likely setup relations in gql schema wrong
                // reminders: [],
                subtasks: [],
                title: "Test Task #1",
            },
        };
        console.log(createTaskMutationVariables);
        const response = await executeGraphQLOperation(
            createTaskMutation,
            createTaskMutationVariables
        );

        const newTask = response.data?.createTask;
        if (!newTask)
            throw new Error(
                `Didn't receive a new task when creating. Response: ${JSON.stringify(
                    response,
                    null,
                    2
                )}`
            );
        setTasks([...tasks, newTask]);

        // TODO: Test the task is added to the account's `.tasks` attribute
        const newTaskAsAccountTask = userTaskToAccountTask(newTask, {
            permissions: 1,
            position: 1,
        });
        updateAccount({
            sub: account.sub,
            tasks: [...tasksOfAccount, newTaskAsAccountTask].map(removeTypenameFromObject),
        });
    }

    async function fetchTasks(variables: ListTasksQueryVariables = {}) {
        const response = await executeGraphQLOperation(listTasksQuery, variables);
        if (response.errors)
            throw new Error(
                `Got unexpected error(s) when fetching tasks: ${JSON.stringify(
                    response.errors,
                    null,
                    2
                )}`
            );

        const tasks = response.data?.listTasks?.items;
        if (!tasks)
            throw new Error(
                `Received falsey value for tasks from response ${JSON.stringify(response, null, 2)}`
            );

        // NB: Could be an empty array as that's not falsey in JS/TS
        const filteredTasks = removeValuesFromArray(tasks, [null]);
        return filteredTasks;
    }

    return (
        <main>
            <Button
                color="inherit"
                onClick={signOut}
                sx={{
                    backgroundColor: "#1e5a68",
                    height: "fit-content",
                }}
            >
                Sign Out
            </Button>

            <h1>{user.username}'s Tasks</h1>
            {tasks.map(task => {
                return <p key={task.id}>{JSON.stringify(task, null, 2)}</p>;
            })}
            {/* <TaskView /> */}
        </main>
    );
}
