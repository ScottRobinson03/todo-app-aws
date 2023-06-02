import { GraphQLResult } from "@aws-amplify/api-graphql/lib-esm/types/";
import { API, graphqlOperation } from "aws-amplify";
import { AccountTask, Task as GraphQLTask } from "../API";
import { GraphQLOperations } from "../types/graphql";
import { sortFn } from "./customSort";

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

// TODO: Remove if is unused within project. Make sure to also remove the custom sort function logic.
export function isDeeplyEqual(a: any, b: any) {
    if (typeof a !== typeof b) return false;
    if (typeof a !== "object") return a === b; // neither values are typeof "object", so return equality

    // We now know that both items are `typeof "object"`, however may still be differing (e.g. Date and Array)

    const aIsNull = a === null;
    const bIsNull = b === null;
    if ((aIsNull || bIsNull) && !(aIsNull && bIsNull)) return false; // only one is null, so not equal
    if (aIsNull) return true; // both null, so equal

    // Check if both are date
    const aIsDate = a instanceof Date;
    const bIsDate = b instanceof Date;
    if ((aIsDate || bIsDate) && !(aIsDate && bIsDate)) return false; // only one is a date, so not equal
    if (aIsDate) return a.valueOf() === b.valueOf();

    // Check if both are array
    const aIsArray = Array.isArray(a);
    const bIsArray = Array.isArray(b);
    if ((aIsArray || bIsArray) && !(aIsArray && bIsArray)) return false; // only one is an array, so not equal
    if (aIsArray && bIsArray) {
        if (a.length !== b.length) return false; // have different lengths, so not equal

        const aCopy = a.slice();
        aCopy.sort(sortFn);

        const bCopy = b.slice();
        bCopy.sort(sortFn);

        for (let i = 0; i < aCopy.length; i++) {
            const itemA = aCopy[i];
            const itemB = bCopy[i];

            if (!isDeeplyEqual(itemA, itemB)) return false; // two subitems aren't equal, so not equal
        }
        return true;
    }

    // Both are objects (the `{key: value}` kind)
    const keysOfA = Object.keys(a);
    let keysOfB = Object.keys(b);
    if (keysOfA.length !== keysOfB.length) return false; // have different amount of keys, so not equal

    for (const keyOfA of keysOfA) {
        const indexOfKeyInB = keysOfB.indexOf(keyOfA);
        if (indexOfKeyInB === -1) return false; // key isn't in both objects, so not equal

        // We now know that the key is in both objects

        keysOfB.splice(indexOfKeyInB, 1);

        const valueOfA = a[keyOfA];
        const valueOfB = b[keyOfA];
        if (!isDeeplyEqual(valueOfA, valueOfB)) return false; // two sub-objects aren't same, so not equal
    }
    if (keysOfB.length) return false; // there are key(s) in second object that aren't in the first, so not equal
    return true;
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
