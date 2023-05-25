import { Button } from "@mui/material";
import TaskView from "./components/TaskView";

import uuid4 from "uuid4";
import { useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { GraphQLResult } from "@aws-amplify/api-graphql/lib-esm/types/";
import { AmplifyUser, AuthEventData } from "@aws-amplify/ui";
import {
    CreateTaskInput,
    CreateTaskMutation,
    CreateTaskMutationVariables,
    Task as GraphQLTask,
    ListTasksQuery,
} from "./API";
import { createTask as createTaskMutation } from "./graphql/mutations";
import { listTasks as listTasksQuery } from "./graphql/queries";

// type Task = Omit<GraphQLTask, "__typename">;
interface AppProps {
    signOut: ((data?: AuthEventData | undefined) => void) | undefined;
    user: AmplifyUser | undefined;
}

// @ts-ignore
export default function App(props: AppProps) {
    const { signOut, user } = props;

    const [formState, setFormState] = useState<CreateTaskInput>({
        completed_at: null,
        created_by_id: "",
        description: null,
        id: "",
        reminder_ids: [],
        subtasks: [],
        title: "",
    });
    const [tasks, setTasks] = useState<GraphQLTask[]>([]);

    useEffect(() => {
        addTask();
        fetchTasks();
    }, []);

    if (signOut === undefined && user === undefined) {
        return <p>'signOut' and 'user' props are both undefined</p>;
    } else if (signOut === undefined) {
        return <p>'signOut' prop is undefined and user is ${user?.getUsername()}</p>;
    } else if (user === undefined) {
        return <p>'user' is undefined</p>;
    }

    // function setInput<key extends keyof CreateTaskInput>(key: key, value: CreateTaskInput[key]) {
    //     setFormState({ ...formState, [key]: value });
    // }

    async function addTask() {
        let sub = user?.attributes?.sub;
        if (!sub) {
            user?.getUserAttributes((err, userAttrs) => {
                if (err) throw new Error(JSON.stringify(err));
                if (!userAttrs) return;
                console.log(userAttrs);
                for (const userAttr of userAttrs) {
                    console.log(JSON.stringify(userAttr));
                    if (userAttr.Name.toLowerCase() === "sub") sub = userAttr.Value;
                }
            });
        }

        if (!sub) {
            console.log("Failed to get sub (id) of currently signed in user");
            return;
        } else {
            console.log(`Sub (id) of currently logged in user is '${sub}'`);
        }

        // TODO: Validate task
        const createTaskMutationVariables: CreateTaskMutationVariables = {
            input: {
                created_by_id: sub,
                id: uuid4(),
                reminder_ids: [],
                subtasks: [],
                title: "Test Task #4",
            },
        };
        console.log(createTaskMutationVariables);

        const operation = graphqlOperation(createTaskMutation, createTaskMutationVariables);
        console.log(operation);
        const response = await (API.graphql(operation) as Promise<
            GraphQLResult<CreateTaskMutation>
        >);
        console.log(response);
    }

    async function fetchTasks() {
        try {
            const response = await (API.graphql(graphqlOperation(listTasksQuery)) as Promise<
                GraphQLResult<ListTasksQuery>
            >);
            const tasks = response.data?.listTasks?.items;
            console.log(JSON.stringify(tasks, null, 2));
            if (tasks === undefined) return;

            const filteredTasks = tasks.filter(task => task !== null) as GraphQLTask[];
            setTasks(filteredTasks);
        } catch (err) {
            console.log(`error fetching tasks: ${JSON.stringify(err)}`);
        }
    }

    // async function addTodo() {
    //     try {
    //         if (!formState.name || !formState.description) return;
    //         const todo = { ...formState };
    //         setTasks([...tasks, todo]);
    //         setFormState(initialState);
    //         await API.graphql(graphqlOperation(createTodo, { input: todo }));
    //     } catch (err) {
    //         console.log("error creating todo:", err);
    //     }
    // }

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
