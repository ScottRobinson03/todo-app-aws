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
import uuid4 from "uuid4";
import { UpdateTaskInput } from "../API";
import { TaskContainerProps } from "../types";
import { getTaskAndSubtaskOf } from "../utils";
import { createReminderSchedule } from "../utils/scheduler";
const { ReactComponent: CompletedTaskIcon } = require("../assets/completed-task.svg");
const { ReactComponent: DeleteIcon } = require("../assets/delete.svg");
const { ReactComponent: EditIcon } = require("../assets/edit.svg");
const { ReactComponent: IncompleteTaskIcon } = require("../assets/incomplete-task.svg");
const { ReactComponent: ReminderIcon } = require("../assets/reminder.svg");

export default function TaskContainer(props: PropsWithChildren<TaskContainerProps>) {
    const [activeModal, setActiveModal] = useState<"edit" | "delete" | "reminder" | null>(null);

    type UpdatableTaskValues = Omit<
        {
            [key in keyof Required<UpdateTaskInput>]: key extends "description"
                ? NonNullable<UpdateTaskInput[key]> | null
                : NonNullable<UpdateTaskInput[key]>;
        },
        "completed_at" | "id" | "subtasks" | "taskCreated_byId"
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
        let target = event.target as Element;
        if (target.nodeName.toLowerCase() === "path") {
            // Get the svg by getting the parent
            if (!target.parentElement) return;
            target = target.parentElement;
        }
        const targetNodeNameLowercase = target.nodeName.toLocaleLowerCase();

        let deleteIcon: Element;
        if (targetNodeNameLowercase !== "svg") {
            // Didn't click on an svg, so ignore
            return;
        }
        if (target.id !== "delete-icon") {
            // Clicked on an svg, but not the delete icon svg, so ignore
            return;
        }
        deleteIcon = target;

        const deleteIconContainer = deleteIcon.parentElement;
        if (!deleteIconContainer || !deleteIconContainer.id.endsWith("delete-container")) {
            // Doesn't have a delete-container parent, so ignore
            return;
        }

        setActiveModal(prevActiveModal => (prevActiveModal === "delete" ? null : "delete"));
    }

    async function handleDeleteConfirm(event: SyntheticEvent) {
        console.log({ handleDeleteClick: event });

        await props.deleteTask({ id: props.userTask.id });
        setActiveModal(null);
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
        if (targetNodeNameLowercase !== "svg") {
            // Didn't click on an svg, so ignore
            return;
        }

        if (target.id !== "edit-icon") {
            // Clicked on an svg, but not the edit icon svg, so ignore
            return;
        }

        editIcon = target;
        const editIconContainer = editIcon.parentElement;
        if (!editIconContainer || !editIconContainer.id.endsWith("edit-container")) {
            // Doesn't have a edit-container parent, so ignore
            return;
        }

        console.log({ handleEditClick: event });

        setActiveModal(prevActiveModal => (prevActiveModal === "edit" ? null : "edit"));
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
            alert("Nothing changed :(");
            return;
        }

        console.log(`Task data to update: ${JSON.stringify(toChange)}`);
        await props.updateTask({ id: props.userTask.id, ...toChange });
        setActiveModal(null);
    }

    function handleReminderClick(event: SyntheticEvent) {
        let target = event.target as Element;
        if (target.nodeName.toLowerCase() === "path") {
            // Get the svg by getting the parent
            if (!target.parentElement) return;
            target = target.parentElement;
        }
        const targetNodeNameLowercase = target.nodeName.toLocaleLowerCase();

        let reminderIcon: Element;
        if (targetNodeNameLowercase !== "svg") {
            // Didn't click on an svg, so ignore
            return;
        }
        if (target.id !== "reminder-icon") {
            // Clicked on an svg, but not the reminder icon svg, so ignore
            return;
        }
        reminderIcon = target;

        const reminderIconContainer = reminderIcon.parentElement;
        if (!reminderIconContainer || !reminderIconContainer.id.endsWith("reminder-container")) {
            // Doesn't have a reminder-container parent, so ignore
            return;
        }

        // Toggle reminder modal
        setActiveModal(prevActiveModal => (prevActiveModal === "reminder" ? null : "reminder"));
    }

    async function createReminder(event: SyntheticEvent) {
        // TODO: Have user account subscribe to the reminders topic if they haven't already
        if (!selectedDatetime) {
            alert("Missing date and time for the reminder to be sent.");
            return;
        }
        const [taskPosition, subtaskId] = getTaskAndSubtaskOf(event.target as Element);
        const formattedTaskId = subtaskId
            ? `${taskPosition}-${subtaskId}`
            : taskPosition.toString();

        const reminderDueAt = selectedDatetime.toISOString().slice(0, -8);
        const reminderPayload = {
            content: `Don't forget about your task: ${props.userTask.title}`,
            due_at: reminderDueAt, // converts to UTC
            reminder_id: uuid4(),
            task_id: formattedTaskId,
            send_to: [props.accountSignedIn.email], // TODO: Use id instead
        };
        console.log("Reminder Payload:\n" + JSON.stringify(reminderPayload, null, 2));

        await createReminderSchedule(reminderPayload);
        setActiveModal(null);
        alert(`Successfully scheduled reminder for ${reminderDueAt}`);
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
                                {/* TODO: Add modal for the ability to create subtasks*/}
                                {/* TODO: Add modal for adding extra users to task (specifying their perms)*/}
                                {/* TODO: Add modal for removing self from the task (delete task if only user who can view)*/}
                                {/* TODO: As owner/admin of task, display modal for viewing & updating perms of people who can see task*/}
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
                                    <div
                                        id="delete-modal"
                                        style={{
                                            alignItems: "center",
                                            backgroundColor: "#1c5260",
                                            display: activeModal === "delete" ? "flex" : "none",
                                            flexDirection: "column",
                                            textAlign: "center",
                                            zIndex: 1,
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: "#e0e1c1",
                                                paddingLeft: "10px",
                                                paddingRight: "10px",
                                                paddingTop: "5px",
                                                textAlign: "center",
                                            }}
                                        >
                                            Are you sure you want to delete this task?
                                        </Typography>
                                        <Button onClick={handleDeleteConfirm}>Yes</Button>
                                        <Button onClick={() => setActiveModal(null)}>Cancel</Button>
                                    </div>
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
                                        <Box
                                            component="form"
                                            noValidate
                                            autoComplete="off"
                                            sx={{
                                                "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
                                                    opacity: 0.9,
                                                },
                                                "& .MuiInputLabel-outlined": {
                                                    WebkitTextFillColor: "#e0e1c1",
                                                    opacity: 0.7,
                                                },
                                                "& .MuiInputBase-input.Mui-disabled": {
                                                    WebkitTextFillColor: "#e0e1c1", // need to duplicate
                                                    opacity: 0.7,
                                                },
                                                "& .MuiInputBase-input": {
                                                    WebkitTextFillColor: "#e0e1c1",
                                                },
                                            }}
                                        >
                                            {/* TODO: Decide whether we actually need to display the task id */}
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
                                                InputLabelProps={{
                                                    shrink: true, // force to always be shrunk since title cannot be empty
                                                }}
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
                                            width: "100%",
                                            zIndex: 1,
                                        }}
                                    >
                                        {/* TODO: Add ability to list/edit/delete existing reminders */}
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
                                                accountSignedIn={props.accountSignedIn}
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
