import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SyntheticEvent } from "react";
import { SortableItemProps, Subtask, Task } from "../types";
import { getTaskAndSubtaskOf, getUTCTime } from "../utils";
import TaskContainer from "./TaskContainer";

export function SortableItem(props: SortableItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: props.task.id,
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
            task={props.task}
            subtasks={props.task.children}
            containerId={`task-${props.task.position || props.task.id}-container`}
            containerStyle={style}
            containerRef={setNodeRef}
            containerListeners={listeners}
            containerAttributes={attributes}
            iconContainerId={`task-${props.task.position || props.task.id}-icon-container`}
            iconContainerClass={`task-icon-container ${
                props.task.completedAt === null ? "incomplete" : "completed"
            }-task`}
            iconContainerOnClick={handleTaskIconClick}
            accordionContainerId={`task-${
                props.task.position || props.task.id
            }-accordion-container`}
            accordionContainerStyle={{ flexGrow: 2, paddingRight: "32px" }}
            accordionStyle={{ backgroundColor: "#1e5a68", paddingBottom: "5px" }}
            accordionIsExpanded={props.activeTask?.split("-")[0] === props.task.id.toString()}
            accordionOnChange={handleChange}
            typographyStylePosition={{ color: "#cfd0b1e2", textAlign: "center", width: "5%" }}
            typographyTextPosition={`#${props.task.position || props.task.id}`}
            typographyStyleTitle={{
                color: "#e0e1c1",
                fontSize: "1.1em",
                marginRight: "2%",
                textAlign: "center",
                width: "100%",
            }}
        />
    );

    function handleTaskIconClick(event: SyntheticEvent) {
        // We can only toggle a tasks completion status if it's the current task.
        if (props.activeTask?.split("-")[0] !== props.task.id.toString()) {
            // Task isn't active, so make it active (but don't change completion status)
            props.setActiveTask(props.task.id.toString());
            return;
        }

        let target = event.target as Element;
        if (target.firstChild?.nodeName.toLowerCase() === "svg") {
            target = target.firstChild as Element;
            // Clicked on the icon-container not the icon itself, so ignore
            return;
        }
        while (target.nodeName.toLowerCase() !== "svg") {
            target = target.parentElement as Element;
            if (!target) {
                console.log("Couldn't find an svg element so ignoring trigger");
                console.log(event.target);
                return;
            }
        }

        const [topLevelTaskPosition, subtaskId] = getTaskAndSubtaskOf(target);
        if (!topLevelTaskPosition) return; // couldn't find the root task

        // Task is active, so toggle the completion status
        props.setTasks(tasks => {
            const newTasks: Task[] = [];

            const indexOfTaskToUpdate = topLevelTaskPosition - 1;
            for (let i = 0; i < tasks.length; i++) {
                const task = { ...tasks[i] };
                if (i === indexOfTaskToUpdate) {
                    if (subtaskId) {
                        // Toggling completion status of a subtask
                        // so find the subtask and update it
                        const newSubtasks: Subtask[] = [];

                        for (let child of task.children) {
                            const subtask = { ...child };
                            if (subtask.id === +subtaskId) {
                                if (subtask.completedAt === null) {
                                    // Marking subtask as complete
                                    subtask.completedAt = getUTCTime();
                                } else {
                                    // Marking subtask as incomplete
                                    // so ensure parent is incomplete too
                                    subtask.completedAt = null;
                                    task.completedAt = null;
                                }
                            }
                            newSubtasks.push(subtask);
                        }
                        task.children = newSubtasks;
                    } else {
                        // Toggling completion status of a root task
                        let canToggle = true;
                        if (task.completedAt === null) {
                            // We're trying to mark a root task as complete
                            // so ensure that all of the subtasks are already completed
                            for (let subtask of task.children) {
                                if (!subtask.completedAt) {
                                    alert(
                                        "You cannot mark a task as complete when it has incomplete subtasks."
                                    );
                                    canToggle = false;
                                    break;
                                }
                            }
                        }
                        if (canToggle)
                            task.completedAt = task.completedAt === null ? getUTCTime() : null;
                    }
                }
                newTasks.push(task);
            }
            return newTasks;
        });
    }

    function handleChange(e: SyntheticEvent, isExpanded: boolean) {
        if (!props.activeTask) {
            const newActiveTask = isExpanded ? props.task.id.toString() : null;
            props.setActiveTask(newActiveTask);
            return;
        }

        const target = e.target as Element;
        const [taskPosition, subtaskId] = getTaskAndSubtaskOf(target);
        if (!taskPosition) return; // couldn't find the root task

        const taskId = props.tasks[taskPosition - 1].id.toString();

        const newActiveTask = isExpanded
            ? subtaskId
                ? `${taskId}-${subtaskId}`
                : taskId
            : subtaskId
            ? taskId
            : null;
        props.setActiveTask(newActiveTask);
    }
}
