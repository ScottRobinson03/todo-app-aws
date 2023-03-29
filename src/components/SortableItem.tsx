import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import { SyntheticEvent } from "react";
import { SortableItemProps, Subtask, Task } from "../types";
const { ReactComponent: IncompleteTaskIcon } = require("../assets/incomplete-task.svg");
const { ReactComponent: CompletedTaskIcon } = require("../assets/completed-task.svg");

export function SortableItem(props: SortableItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: props.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: "3px",
        display: "flex",
    };

    function getUTCTime() {
        return new Date().toISOString().slice(0, -5).replace("T", " ");
    }

    function getTaskAndSubtaskOf(element: Element): [number, string | null] {
        let topLevelTaskPosition: number;
        let subtaskId: string | null = null;

        while (true) {
            const topLevelTaskMatch = element.id.match(
                /^task-(\d+)-(?:(?:icon|accordion)-)?container/
            );
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

    function handleChange(e: SyntheticEvent, isExpanded: boolean) {
        if (!props.activeTask) {
            const newActiveTask = isExpanded ? props.id.toString() : null;
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

    function handleTaskIconClick(event: SyntheticEvent) {
        // We can only toggle a tasks completion status if it's the current task.
        if (props.activeTask?.split("-")[0] !== props.id.toString()) {
            // Task isn't active, so make it active (but don't change completion status)
            props.setActiveTask(props.id.toString());
            return;
        }

        let target = event.target as Element;
        while (target.nodeName.toLowerCase() !== "svg") {
            target = target.parentElement as Element;
            if (!target) {
                console.log("Couldn't find an svg element so ignoring trigger");
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

    return (
        <div
            id={`task-${props.position || props.id}-container`}
            style={style}
            ref={setNodeRef}
            {...listeners}
            {...attributes}
        >
            <div
                id={`task-${props.position || props.id}-icon-container`}
                className={`task-icon-container ${
                    props.completedAt === null ? "incomplete" : "completed"
                }-task`}
                onClick={handleTaskIconClick}
            >
                {props.completedAt === null ? <IncompleteTaskIcon /> : <CompletedTaskIcon />}
            </div>
            <div
                id={`task-${props.position || props.id}-accordion-container`}
                style={{ flexGrow: 2, paddingRight: "32px" }}
            >
                <Accordion
                    sx={{ backgroundColor: "#1e5a68", paddingBottom: "5px" }}
                    expanded={props.activeTask?.split("-")[0] === props.id.toString()}
                    onChange={handleChange}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <Typography
                            sx={{
                                color: "#cfd0b1e2",
                                textAlign: "center",
                                width: "5%",
                            }}
                        >
                            #{props.position || props.id}
                        </Typography>
                        <Typography
                            sx={{
                                color: "#e0e1c1",
                                fontSize: "1.1em",
                                marginRight: "3%",
                                textAlign: "center",
                                width: "100%",
                            }}
                        >
                            {props.title}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails
                        sx={{
                            borderBottom: "2px #184e57 solid",
                            borderTop: "2px #184e57 solid",
                            padding: 0,
                            margin: "0px 16px",
                        }}
                    >
                        <Typography sx={{ color: "#e0e1c1", textAlign: "center" }}>
                            {props.description}
                        </Typography>
                        {props.children.length ? (
                            <div className="subtasks-container">
                                <Typography
                                    sx={{
                                        color: "#e0e1c1",
                                        fontSize: "1.1em",
                                        textAlign: "center",
                                        textDecoration: "underline",
                                    }}
                                >
                                    Subtasks
                                </Typography>
                                {props.children.map(subtask => {
                                    return (
                                        <div
                                            id={`subtask-${subtask.id}-container`}
                                            className="subtask-container"
                                            key={subtask.id}
                                        >
                                            <div
                                                id={`subtask-${subtask.id}-icon-container`}
                                                className={`subtask-icon-container ${
                                                    props.completedAt === null
                                                        ? "incomplete"
                                                        : "completed"
                                                }-subtask`}
                                                onClick={handleTaskIconClick}
                                            >
                                                {subtask.completedAt === null ? (
                                                    <IncompleteTaskIcon />
                                                ) : (
                                                    <CompletedTaskIcon />
                                                )}
                                            </div>
                                            <div
                                                id={`subtask-${subtask.id}-accordion-container`}
                                                style={{ flexGrow: 2 }}
                                            >
                                                <Accordion
                                                    sx={{
                                                        backgroundColor: "#1c5260",
                                                        paddingBottom: "5px",
                                                    }}
                                                    expanded={
                                                        props.activeTask?.split("-")[1] ===
                                                        subtask.id.toString()
                                                    }
                                                    onChange={handleChange}
                                                >
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls="panel1bh-content"
                                                        id="panel1bh-header"
                                                    >
                                                        <Typography
                                                            sx={{
                                                                color: "#e0e1c1",
                                                                fontSize: "1.1em",
                                                                marginRight: "3%",
                                                                width: "100%",
                                                            }}
                                                        >
                                                            {subtask.title}
                                                        </Typography>
                                                    </AccordionSummary>

                                                    <AccordionDetails
                                                        sx={{
                                                            borderBottom: "2px #184e57 solid",
                                                            borderTop: "2px #184e57 solid",
                                                            padding: 0,
                                                            margin: "0px 16px",
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                color: "#e0e1c1",
                                                                textAlign: "center",
                                                            }}
                                                        >
                                                            {subtask.description ||
                                                                "(No Task Description Provided)"}
                                                        </Typography>
                                                    </AccordionDetails>
                                                </Accordion>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <></>
                        )}
                    </AccordionDetails>
                </Accordion>
            </div>
        </div>
    );
}
