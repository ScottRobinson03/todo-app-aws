import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableItemProps, Task } from "../types";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SyntheticEvent } from "react";
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

    function handleChange(_: SyntheticEvent, isExpanded: boolean) {
        const newActiveTask = isExpanded ? props.id : null;
        console.log(`Setting active task to ${newActiveTask}`);
        props.setActiveTask(newActiveTask);
    }

    function handleTaskIconClick(_: SyntheticEvent) {
        // We can only toggle a tasks completion status if it's the current task.

        if (props.activeTask !== props.id) {
            // Task isn't active, so make it active (but don't change completion status)
            props.setActiveTask(props.id);
            return;
        }

        // Task is active, so toggle the completion status
        props.setTasks(tasks => {
            const newTasks: Task[] = [];

            const indexOfTaskToUpdate = (props.position || props.id) - 1;
            for (let i = 0; i < tasks.length; i++) {
                const task = { ...tasks[i] };
                if (i === indexOfTaskToUpdate) {
                    task.completedAt = task.completedAt === null ? new Date() : null;
                }
                newTasks.push(task);
            }
            return newTasks;
        });
    }

    return (
        <div style={style} ref={setNodeRef} {...listeners} {...attributes}>
            <div
                id={`task-${props.id}-icon-container`}
                className={`task-icon-container ${
                    props.completedAt === null ? "incomplete" : "completed"
                }-task`}
                onClick={handleTaskIconClick}
            >
                {props.completedAt === null ? <IncompleteTaskIcon /> : <CompletedTaskIcon />}
            </div>
            <div style={{ flexGrow: 2 }}>
                <Accordion
                    sx={{ backgroundColor: "#1e5a68" }}
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
                                width: "5%",
                                flexShrink: 0,
                                boxSizing: "border-box",
                                textAlign: "center",
                                alignContent: "center",
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
                    <AccordionDetails sx={{ borderTop: "2px #184e57 solid", padding: "8px 16px" }}>
                        <Typography sx={{ color: "#e0e1c1" }}>{props.description}</Typography>
                    </AccordionDetails>
                </Accordion>
            </div>
        </div>
    );
}
