import { ExpandMore, Send } from "@mui/icons-material";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    TextField,
    Typography,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { FocusEvent, PropsWithChildren, SyntheticEvent, useState } from "react";
import { TaskContainerProps } from "../types";
import { getTaskAndSubtaskOf } from "../utils";
import { UpdateTaskInput } from "../API";
const { ReactComponent: CompletedTaskIcon } = require("../assets/completed-task.svg");
const { ReactComponent: DeleteIcon } = require("../assets/delete.svg");
const { ReactComponent: EditIcon } = require("../assets/edit.svg");
const { ReactComponent: IncompleteTaskIcon } = require("../assets/incomplete-task.svg");
const { ReactComponent: ReminderIcon } = require("../assets/reminder.svg");

export default function TaskContainer(props: PropsWithChildren<TaskContainerProps>) {
    const [activeModal, setActiveModal] = useState<"edit" | "reminder" | null>(null);

    type UpdatableTaskValues = Omit<
        {
            [key in keyof Required<UpdateTaskInput>]: key extends "description"
                ? NonNullable<UpdateTaskInput[key]> | null
                : NonNullable<UpdateTaskInput[key]>;
        },
        "completed_at" | "id" | "subtasks" | "taskCreated_bySub"
    >;
    const [formValues, setFormValues] = useState<UpdatableTaskValues>({
        title: props.userTask.title,
        description: props.userTask.description ?? null,
    });

    const currentDatetime = new Date();
    const [selectedDatetime, setSelectedDatetime] = useState<Dayjs | null>(
        dayjs(currentDatetime.setHours(currentDatetime.getHours() + 24))
    );

    async function handleDeleteClick(event: SyntheticEvent) {
        console.log({ handleDeleteClick: event });
        setActiveModal(null);

        // TODO: Maybe add a confirmation?
        await props.deleteTask({ id: props.userTask.id });
    }

    function handleEditClick(event: SyntheticEvent) {
        let target = event.target as Element;
        if (target.nodeName.toLowerCase() === "path") {
            // Get the svg by getting the parent
            if (!target.parentElement) return;
            target = target.parentElement;
        }
        const targetNodeNameLowercase = target.nodeName.toLocaleLowerCase();

        let editIcon: Element;
        if (targetNodeNameLowercase === "div") {
            const temp = target.children.namedItem("edit-icon");
            if (!temp) {
                // Clicked on a div, but it doesn't have a
                // child element with the id 'edit-icon', so ignore
                return;
            }
            editIcon = temp;
        } else if (targetNodeNameLowercase === "svg") {
            if (target.id !== "edit-icon") {
                // Clicked on an svg, but not the edit icon svg, so ignore
                return;
            }
            editIcon = target;
        } else {
            // Didn't click on an svg/div, so ignore
            return;
        }
        const editIconContainer = editIcon.parentElement;
        if (!editIconContainer || !editIconContainer.id.endsWith("edit-container")) {
            // Doesn't have a edit-container parent, so ignore
            return;
        }

        console.log({ handleEditClick: event });

        if (activeModal === "edit") {
            setActiveModal(null);
            return;
        }
        setActiveModal("edit");
    }

    function handleEditInputBlur(
        event: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>
    ) {
        console.log({ handleEditInputBlur: event });

        const target = event.target;
        const label = target.parentElement?.children[1]?.firstChild?.firstChild?.textContent as
            | keyof UpdatableTaskValues
            | undefined;
        if (!label) {
            console.log("Unable to find label of input");
            return;
        }

        const newValue = target.value;

        if (formValues[label] ?? "" !== newValue) {
            if (!newValue && label !== "description") {
                // Only description is optional, so when anything else is empty it's invalid
                alert(`New ${label} cannot be empty!`);

                // BUG: For some reason the label drops into the input despite there being text
                target.value = formValues[label];

                return;
            }

            setFormValues(oldFormValues => {
                console.log(`Setting new ${label} to ${newValue ? `'${newValue}'` : null}`);
                return { ...oldFormValues, [label]: newValue || null };
            });
        }
    }

    async function handleEditSave(event: SyntheticEvent) {
        console.log({ handleEditSave: event });
        const toChange: Partial<UpdatableTaskValues> = {};
        let hasChanges = false;
        for (const [key, value] of Object.entries(formValues)) {
            if (props.userTask[key as keyof UpdatableTaskValues] !== value) {
                toChange[key as keyof UpdatableTaskValues] = value as never;
                hasChanges = true;
            }
        }

        if (!hasChanges) {
            console.log("Nothing to update in task");
            return;
        }

        console.log(`Task data to update: ${JSON.stringify(toChange)}`);
        await props.updateTask({ id: props.userTask.id, ...toChange });
    }

    function handleReminderClick(event: SyntheticEvent) {
        // FIXME: Clicking underneath reminder svg when edit modal is active, results in reminder modal activiting?
        let target = event.target as Element;
        if (target.nodeName.toLowerCase() === "path") {
            // Get the svg by getting the parent
            if (!target.parentElement) return;
            target = target.parentElement;
        }
        const targetNodeNameLowercase = target.nodeName.toLocaleLowerCase();

        let reminderIcon: Element;
        if (targetNodeNameLowercase === "div") {
            const temp = target.children.namedItem("reminder-icon");
            if (!temp) {
                // Clicked on a div, but it doesn't have a
                // child element with the id 'reminder-icon', so ignore
                return;
            }
            reminderIcon = temp;
        } else if (targetNodeNameLowercase === "svg") {
            if (target.id !== "reminder-icon") {
                // Clicked on an svg, but not the reminder icon svg, so ignore
                return;
            }
            reminderIcon = target;
        } else {
            // Didn't click on an svg/div, so ignore
            return;
        }
        const reminderIconContainer = reminderIcon.parentElement;
        if (!reminderIconContainer || !reminderIconContainer.id.endsWith("reminder-container")) {
            // Doesn't have a reminder-container parent, so ignore
            return;
        }
        // Toggle reminder modal

        if (activeModal === "reminder") {
            setActiveModal(null);
            return;
        }
        setActiveModal("reminder");
    }

    function createReminder(event: SyntheticEvent) {
        if (!selectedDatetime) {
            alert("Missing date and time for the reminder to be sent.");
            return;
        }
        const [taskPosition, subtaskId] = getTaskAndSubtaskOf(event.target as Element);
        const formattedTaskId = subtaskId
            ? `${taskPosition}-${subtaskId}`
            : taskPosition.toString();

        const reminderPayload = {
            content:
                `Don't forget about task ${taskPosition}` +
                (subtaskId ? `'s subtask ${subtaskId}` : ""),
            sendAt: selectedDatetime.toISOString(), // converts to UTC
            taskId: formattedTaskId,
        };
        console.log("Fake Reminder Payload:\n" + JSON.stringify(reminderPayload, undefined, 4));
        setActiveModal(null);
    }

    const taskIsComplete = typeof props.userTask.completed_at === "number";
    const completedOrIncomplete = taskIsComplete ? "completed" : "incomplete";

    return (
        <div
            id={props.containerId}
            style={props.containerStyle}
            ref={props.containerRef}
            {...props.containerListeners}
            {...props.containerAttributes}
        >
            <div
                id={props.iconContainerId}
                className={props.iconContainerClass}
                onClick={props.iconContainerOnClick}
            >
                {taskIsComplete ? <CompletedTaskIcon /> : <IncompleteTaskIcon />}
            </div>
            <div id={props.accordionContainerId} style={props.accordionContainerStyle}>
                <Accordion
                    // @ts-ignore
                    sx={props.accordionStyle}
                    expanded={props.accordionIsExpanded}
                    onChange={props.accordionOnChange}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        {props.typographyStylePosition && (
                            // @ts-ignore
                            <Typography sx={props.typographyStylePosition}>
                                {props.typographyTextPosition}
                            </Typography>
                        )}
                        <Typography
                            className={`${completedOrIncomplete}-task-title`}
                            // @ts-ignore
                            sx={props.typographyStyleTitle}
                        >
                            {props.userTask.title}
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
                            className={`${completedOrIncomplete}-task-description`}
                            sx={{
                                color: "#e0e1c1",
                                textAlign: "center",
                                opacity: props.userTask.description
                                    ? taskIsComplete
                                        ? 0.5 // has description and is complete
                                        : 0.9 // has description and is NOT complete
                                    : taskIsComplete
                                    ? 0.5 // DOESN'T have description and is complete
                                    : 0.7, // DOESN'T have description and is NOT complete
                            }}
                        >
                            {props.userTask.description || "(No Task Description Provided)"}
                        </Typography>
                        {taskIsComplete ? (
                            <></>
                        ) : (
                            <div
                                id={`${
                                    props.typographyTextPosition
                                        ? `task-${props.typographyTextPosition.slice(1)}`
                                        : `subtask-${props.userTask.id}`
                                }-icons-container`}
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                }}
                                className="icons-container"
                            >
                                <div
                                    id={`${
                                        props.typographyTextPosition
                                            ? `task-${props.typographyTextPosition.slice(1)}`
                                            : `subtask-${props.userTask.id}`
                                    }-delete-container`}
                                    className="delete-container"
                                    onClick={handleDeleteClick}
                                >
                                    <DeleteIcon />
                                </div>
                                <div
                                    id={`${
                                        props.typographyTextPosition
                                            ? `task-${props.typographyTextPosition.slice(1)}`
                                            : `subtask-${props.userTask.id}`
                                    }-edit-container`}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                    }}
                                    className="edit-container"
                                    onClick={handleEditClick}
                                >
                                    <EditIcon />
                                    <div
                                        id="edit-modal"
                                        style={{
                                            alignItems: "center",
                                            backgroundColor: "#1c5260",
                                            display: activeModal === "edit" ? "flex" : "none",
                                            flexDirection: "column",
                                            textAlign: "center",
                                            zIndex: 1,
                                        }}
                                    >
                                        <Box component="form" noValidate autoComplete="off">
                                            <TextField
                                                disabled
                                                fullWidth
                                                id="outlined-read-only-input"
                                                label="id"
                                                value={props.userTask.id}
                                            />
                                            <TextField
                                                fullWidth
                                                id="outlined"
                                                label="title"
                                                defaultValue={formValues.title}
                                                onBlur={handleEditInputBlur}
                                            />
                                            <TextField
                                                fullWidth
                                                id="outlined"
                                                label="description"
                                                defaultValue={formValues.description}
                                                onBlur={handleEditInputBlur}
                                            />
                                            <Button
                                                style={{
                                                    backgroundColor: "#0b6795",
                                                    color: "#10c1ed",
                                                    width: "100%",
                                                }}
                                                onClick={handleEditSave}
                                            >
                                                Save
                                            </Button>
                                        </Box>
                                    </div>
                                </div>
                                <div
                                    id={`${
                                        props.typographyTextPosition
                                            ? `task-${props.typographyTextPosition.slice(1)}`
                                            : `subtask-${props.userTask.id}`
                                    }-reminder-container`}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                    }}
                                    className="reminder-container"
                                    onClick={handleReminderClick}
                                >
                                    <ReminderIcon />
                                    <div
                                        id="reminder-modal"
                                        style={{
                                            alignItems: "center",
                                            backgroundColor: "#1c5260",
                                            display: activeModal === "reminder" ? "flex" : "none",
                                            flexDirection: "column",
                                            padding: "15px 0",
                                            textAlign: "center",
                                            width: "50%",
                                            zIndex: 1,
                                        }}
                                    >
                                        <Typography sx={{ color: "#e0e1c1" }}>
                                            Create Reminder
                                        </Typography>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DateTimePicker
                                                ampm={false} // force 24 hour clock
                                                disablePast={true}
                                                format="YYYY-MM-DD HH:mm" // year-month-day hours:minutes
                                                label="Send At"
                                                onChange={setSelectedDatetime}
                                                sx={{
                                                    input: { color: "#e0e1c1", width: "150px" },
                                                    label: { color: "#e0e1c1" },
                                                    marginTop: "15px",
                                                }}
                                                value={selectedDatetime}
                                            />
                                            <Button
                                                endIcon={<Send />}
                                                onClick={createReminder}
                                                size="small"
                                                type="submit"
                                                variant="contained"
                                            >
                                                Create
                                            </Button>
                                        </LocalizationProvider>
                                    </div>
                                </div>
                            </div>
                        )}
                        {"subtasks" in props.userTask && props.userTask.subtasks.length > 0 && (
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
                                {props.subtasks &&
                                    props.subtasks.map(subtask => {
                                        return (
                                            <TaskContainer
                                                key={`${subtask.id}-subtask-task-container`}
                                                activeTask={props.activeTask}
                                                userTask={subtask}
                                                containerId={`subtask-${subtask.id}-container`}
                                                containerStyle={{ display: "flex" }}
                                                iconContainerId={`subtask-${subtask.id}-icon-container`}
                                                iconContainerClass={`subtask-icon-container ${
                                                    typeof subtask.completed_at === "number"
                                                        ? "completed"
                                                        : "incomplete"
                                                }-subtask`}
                                                iconContainerOnClick={props.iconContainerOnClick}
                                                accordionContainerId={`subtask-${subtask.id}-accordion-container`}
                                                accordionContainerStyle={{ flexGrow: 2 }}
                                                accordionStyle={{
                                                    backgroundColor: "#1c5260",
                                                    paddingBottom: "5px",
                                                }}
                                                accordionIsExpanded={
                                                    props.activeTask?.split("-")[1] ===
                                                    subtask.id.toString()
                                                }
                                                accordionOnChange={props.accordionOnChange}
                                                typographyStyleTitle={{
                                                    color: "#e0e1c1",
                                                    fontSize: "1.1em",
                                                    marginRight: "3%",
                                                    width: "100%",
                                                }}
                                                deleteTask={props.deleteTask}
                                                updateTask={props.updateTask}
                                            />
                                        );
                                    })}
                            </div>
                        )}
                    </AccordionDetails>
                </Accordion>
            </div>
        </div>
    );
}
