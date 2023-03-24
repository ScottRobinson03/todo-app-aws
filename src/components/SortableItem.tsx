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

    function handleChange(_: SyntheticEvent, isExpanded: boolean) {
        const newActiveTask = isExpanded ? props.id : null;
        props.setActiveTask(newActiveTask);
    }

    function handleTaskIconClick(event: SyntheticEvent) {
        // We can only toggle a tasks completion status if it's the current task.
        if (props.activeTask !== props.id) {
            // Task isn't active, so make it active (but don't change completion status)
            props.setActiveTask(props.id);
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

        let topLevelTaskPosition: number;
        let subtaskId: number | null = null;
        while (true) {
            const topLevelTaskMatch = target.id.match(/task-(\d+)-container/);
            if (topLevelTaskMatch) {
                topLevelTaskPosition = +topLevelTaskMatch[1];
                break;
            }

            if (!subtaskId) {
                // Haven't already found the subtask, so see if this is the subtask icon container
                const subtaskMatch = target.id.match(/subtask-(\d+)-icon-container/);
                if (subtaskMatch) {
                    subtaskId = +subtaskMatch[1];
                    // NB: We don't break since we still need the parent task position
                    // in order to update the subtask, since the subtask is stored within the parent
                }
            }

            target = target.parentElement as Element;
            if (!target) {
                console.log("Couldn't find the task-{position}-container so ignoring trigger");
                return;
            }
        }

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
                            if (subtask.id === subtaskId) {
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
            <div style={{ flexGrow: 2, paddingRight: "32px" }}>
                <Accordion
                    sx={{ backgroundColor: "#1e5a68", paddingBottom: "5px" }}
                    expanded={props.activeTask === props.id}
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
                            padding: "8px 16px",
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
                                        textDecoration: "underline",
                                    }}
                                >
                                    Subtasks
                                </Typography>
                                {props.children.map(subtask => {
                                    return (
                                        <div className="subtask-container" key={subtask.id}>
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
                                            <div style={{ flexGrow: 2 }}>
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
