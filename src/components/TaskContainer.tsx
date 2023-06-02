import { ExpandMore, Send } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PropsWithChildren, SyntheticEvent, useState } from "react";
import { TaskContainerProps } from "../types";
import { getTaskAndSubtaskOf } from "../utils";
import dayjs, { Dayjs } from "dayjs";
const { ReactComponent: IncompleteTaskIcon } = require("../assets/incomplete-task.svg");
const { ReactComponent: CompletedTaskIcon } = require("../assets/completed-task.svg");
const { ReactComponent: ReminderIcon } = require("../assets/reminder.svg");

export default function TaskContainer(props: PropsWithChildren<TaskContainerProps>) {
    function handleReminderClick(event: SyntheticEvent) {
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
        setShowModal(!showModal);
    }

    function createReminder(event: SyntheticEvent) {
        const [taskPosition, subtaskId] = getTaskAndSubtaskOf(event.target as Element);
        const formattedTaskId = subtaskId
            ? `${taskPosition}-${subtaskId}`
            : taskPosition.toString();

        const reminderPayload = {
            content:
                `Don't forget about task ${taskPosition}` +
                (subtaskId ? `'s subtask ${subtaskId}` : ""),
            sendAt: selectedDatetime?.toISOString(), // converts to UTC
            taskId: formattedTaskId,
        };
        console.log("Fake Reminder Payload:\n" + JSON.stringify(reminderPayload, undefined, 4));
    }
    const [showModal, setShowModal] = useState<boolean>(false);

    const currentDatetime = new Date();
    const [selectedDatetime, setSelectedDatetime] = useState<Dayjs | null>(
        dayjs(currentDatetime.setHours(currentDatetime.getHours() + 24))
    );

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
                            <Typography sx={props.typographyStylePosition}>
                                {props.typographyTextPosition}
                            </Typography>
                        )}
                        <Typography
                            className={`${completedOrIncomplete}-task-title`}
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
                                        display: showModal ? "flex" : "none",
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
                                                key={subtask.id}
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
