import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SyntheticEvent } from "react";
import { SortableItemProps } from "../types";
import { getTaskAndSubtaskOf, getUTCTime } from "../utils";
import TaskContainer from "./TaskContainer";

export function SortableItem(props: SortableItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: props.userTask.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: "3px",
        display: "flex",
    };

    return (
        <TaskContainer
            activeTask={props.activeTask}
            accountSignedIn={props.accountSignedIn}
            userTask={props.userTask}
            subtasks={props.userTask.subtasks}
            containerId={`task-${props.accountTask.position || props.userTask.id}-container`}
            containerStyle={style}
            containerRef={setNodeRef}
            containerListeners={listeners}
            containerAttributes={attributes}
            iconContainerId={`task-${
                props.accountTask.position || props.userTask.id
            }-icon-container`}
            iconContainerClass={`task-icon-container ${
                typeof props.userTask.completed_at === "number" ? "completed" : "incomplete"
            }-task`}
            iconContainerOnClick={handleTaskIconClick}
            accordionContainerId={`task-${
                props.accountTask.position || props.userTask.id
            }-accordion-container`}
            accordionContainerStyle={{ flexGrow: 2, paddingRight: "32px" }}
            accordionStyle={{ backgroundColor: "#1e5a68", paddingBottom: "5px" }}
            accordionIsExpanded={props.activeTask?.split("|")[0] === props.userTask.id}
            accordionOnChange={handleChange}
            typographyStylePosition={{ color: "#cfd0b1e2", textAlign: "center", width: "5%" }}
            typographyTextPosition={`#${props.accountTask.position || props.userTask.id}`}
            typographyStyleTitle={{
                color: "#e0e1c1",
                fontSize: "1.1em",
                marginRight: "2%",
                textAlign: "center",
                width: "100%",
            }}
            deleteTask={props.deleteTask}
            updateTask={props.updateTask}
        />
    );

    async function handleTaskIconClick(event: SyntheticEvent) {
        // BUG: The icons can get out-of-sync with the tasks (will mark wrong task as [in]complete)
        console.log({ handleTaskIconClick: event });
        // We can only toggle a tasks completion status if it's the current task.
        if (props.activeTask?.split("|")[0] !== props.accountTask.task_id) {
            // Task isn't active, so make it active (but don't change completion status)
            props.setActiveTask(props.accountTask.task_id);
            console.log(`Set task ${props.accountTask.task_id} to active`);
            return;
        }

        let target = event.target as Element;
        if (target.firstChild?.nodeName.toLowerCase() === "svg") {
            target = target.firstChild as Element;
            // Clicked on the icon-container not the icon itself, so ignore
            console.log("Clicked on icon-container so ignoring");
            return;
        }
        while (target.nodeName.toLowerCase() !== "svg") {
            target = target.parentElement as Element;
            if (!target) {
                console.log("Couldn't find an svg element so ignoring trigger:");
                console.log(event.target);
                return;
            }
        }

        const [topLevelTaskPosition, subtaskId] = getTaskAndSubtaskOf(target);
        if (!topLevelTaskPosition) return; // couldn't find the root task

        if (subtaskId) {
            // Toggling completion status of a subtask
            let updatedSubtask = null;
            for (const subtask of props.userTask.subtasks) {
                if (subtask.id === subtaskId) {
                    subtask.completed_at =
                        typeof subtask.completed_at === "number" ? null : getUTCTime();
                    updatedSubtask = subtask;
                    break;
                }
            }
            if (!updatedSubtask) {
                console.log("Couldn't find subtask to toggle its completion status");
                return;
            }
            // TODO: See whether we need to update task within props.userTasks (shouldn't need to)
            console.log(props.userTask);
            console.log(props.userTasks);

            // TODO: Update task in database
        } else {
            // Toggling completion status of a root task
            const newCompletedAtValue =
                typeof props.userTask.completed_at === "number" ? null : getUTCTime();

            if (typeof newCompletedAtValue === "number") {
                // Marking task as complete, so ensure all of the task's subtasks are complete
                let allSubtasksAreComplete = true;

                props.userTask.subtasks.forEach(subtask => {
                    if (typeof subtask.completed_at !== "number") {
                        allSubtasksAreComplete = false;
                        alert("You cannot mark a task as complete when it has incomplete subtasks");
                        return;
                    }
                });
                if (!allSubtasksAreComplete) return;

                // All subtasks are complete, so update root task
                props.userTask.completed_at = newCompletedAtValue; // NB: This automatically updates `props.userTasks`
                console.log(props.userTask);
                console.log(props.userTasks);
            } else {
                props.userTask.completed_at = newCompletedAtValue; // NB: This automatically updates `props.userTasks`
            }
            await props.updateTask({
                id: props.userTask.id,
                completed_at: newCompletedAtValue,
            });
        }
    }

    function handleChange(e: SyntheticEvent, isExpanded: boolean) {
        console.log({ handleChange: e });
        if (!props.activeTask) {
            const newActiveTask = isExpanded ? props.accountTask.task_id : null;
            props.setActiveTask(newActiveTask);
            console.log(`Set ${newActiveTask} to the new active task`);
            return;
        }

        const target = e.target as Element;
        const [taskPosition, subtaskId] = getTaskAndSubtaskOf(target);
        if (!taskPosition) {
            // Couldn't find the root task, so ignore
            console.log("Couldn't find root task so ignoring");
            return;
        }

        // FIXME: Assume I have to loop over array and match `position` attr
        // *Might* be able to just use `props.accountTask`/`props.userTask`
        const taskId = props.accountTasks[taskPosition - 1].task_id;

        const newActiveTask = isExpanded
            ? subtaskId
                ? `${taskId}|${subtaskId}`
                : taskId
            : subtaskId
            ? taskId
            : null;
        props.setActiveTask(newActiveTask);
    }
}
