import { GraphQLResult } from "@aws-amplify/api-graphql/lib-esm/types/";
import { API, graphqlOperation } from "aws-amplify";
import { AccountTask, Task as GraphQLTask } from "../API";
import { GraphQLOperations } from "../types/graphql";

export function ensureExactKeys<T extends object>(
    obj: T,
    wantedKeys: (string | number | symbol)[],
    stripExtraKeys: boolean = true
) {
    const originalWantedKeys = [...wantedKeys];
    const allWantedKeys = wantedKeys.map(k =>
        typeof k === "string" ? (k.endsWith("?") ? k.slice(0, -1) : k) : k
    );

    const objWithOnlyWantedKeys = Object.fromEntries(
        Object.entries(obj).filter(([key, _]) => {
            if (allWantedKeys.includes(key)) {
                wantedKeys = wantedKeys.filter(wantedKey => wantedKey !== key);
                return true;
            }
            if (stripExtraKeys) return false;
            throw new Error(
                `Found extra key '${key}' in object ${JSON.stringify(
                    obj
                )}. Expected keys: ${JSON.stringify(originalWantedKeys)}.`
            );
        })
    ) as T;
    if (wantedKeys.filter(k => (typeof k === "string" ? !k.endsWith("?") : true)).length) {
        // Not all wanted, required, keys are in the object
        throw new Error(
            `Missing keys from object.
            Missing Keys: ${wantedKeys.map(k => `'${String(k)}'`).join(",")}
            Object: ${JSON.stringify(obj)}`
        );
    }
    // All wanted keys are in the object
    return objWithOnlyWantedKeys;
}

export async function executeGraphQLOperation<Operation extends keyof GraphQLOperations>(
    operation: Operation,
    variables: GraphQLOperations[Operation]["variables"]
) {
    return API.graphql({
        ...graphqlOperation(operation, variables),
        authMode: "AMAZON_COGNITO_USER_POOLS",
    }) as Promise<GraphQLResult<GraphQLOperations[Operation]["response"]>>;
}

export function getNextPosition(tasksOfAccount: AccountTask[]) {
    const takenPositions = [...new Set(tasksOfAccount.map(accountTask => accountTask.position))];
    takenPositions.sort((a, b) => (a < b ? -1 : a === b ? 0 : 1));

    let prevPosition = 0;
    for (const takenPosition of takenPositions.values()) {
        if (takenPosition !== prevPosition + 1) break; // next position is free
        prevPosition += 1; // next position isn't free
    }
    return prevPosition + 1;
}

export function getTaskAndSubtaskOf(element: Element): [number, string | null] {
    let topLevelTaskPosition: number;
    let subtaskId: string | null = null;

    while (true) {
        const topLevelTaskMatch = element.id.match(
            /^task-(\d+)-(?:(?:icon|accordion|reminder)-)?container/
        );
        if (topLevelTaskMatch) {
            topLevelTaskPosition = +topLevelTaskMatch[1];
            break;
        }

        if (!subtaskId) {
            // Haven't already found the subtask, so see if this is the subtask icon container
            const subtaskMatch = element.id.match(
                /^subtask-(\d+)-(?:(?:icon|accordion|reminder)-)?container/
            );

            if (subtaskMatch) {
                subtaskId = subtaskMatch[1];
                // NB: We don't break since we still need the parent task position
                // in order to update the subtask, since the subtask is stored within the parent
            }
        }

        element = element.parentElement as Element;
        if (!element) {
            console.log("Couldn't find the task-{position}-container so ignoring trigger");
            return [0, null];
        }
    }
    return [topLevelTaskPosition, subtaskId];
}

export function getUTCTime() {
    return new Date().valueOf(); //.toISOString().slice(0, -5).replace("T", " ");
}

export const isKeyOf = <K extends string | number | symbol, Obj extends object>(
    k: K,
    obj: Obj
): k is Extract<keyof Obj, K> => k in obj;

export function removeTypenameFromObject<T extends Record<"__typename", string>>(obj: T) {
    const { __typename, ...objWithoutTypename } = obj;
    return objWithoutTypename;
}

export function removeValuesFromArray<T, V>(arr: T[], values: V[]) {
    return arr.filter((item): item is Exclude<T, V> => !values.includes(item as never));
}

export function userTaskToAccountTask(
    userTask: GraphQLTask,
    { permissions, position }: { permissions?: number; position: number }
): AccountTask {
    return {
        __typename: "AccountTask",
        // TODO: Change to utilise permissions enum
        permissions: permissions ?? 2, // default to read-only perms
        position,
        reminder_ids: removeValuesFromArray(userTask.reminders?.items ?? [], [null]).map(
            reminder => reminder.id
        ),
        task_id: userTask.id,
    };
}
