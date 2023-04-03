export function getUTCTime() {
    return new Date().toISOString().slice(0, -5).replace("T", " ");
}

export function getTaskAndSubtaskOf(element: Element): [number, string | null] {
    let topLevelTaskPosition: number;
    let subtaskId: string | null = null;

    while (true) {
        const topLevelTaskMatch = element.id.match(/^task-(\d+)-(?:(?:icon|accordion)-)?container/);
        if (topLevelTaskMatch) {
            topLevelTaskPosition = +topLevelTaskMatch[1];
            break;
        }

        if (!subtaskId) {
            // Haven't already found the subtask, so see if this is the subtask icon container
            const subtaskMatch = element.id.match(
                /^subtask-(\d+)-(?:(?:icon|accordion)-)?container/
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
