import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import { PropsWithChildren } from "react";
import { TaskContainerProps } from "../types";
const { ReactComponent: IncompleteTaskIcon } = require("../assets/incomplete-task.svg");
const { ReactComponent: CompletedTaskIcon } = require("../assets/completed-task.svg");

export default function TaskContainer(props: PropsWithChildren<TaskContainerProps>) {
    const taskIsComplete = props.task.completedAt !== null;
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
                        expandIcon={<ExpandMoreIcon />}
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
                            {props.task.title}
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
                                opacity: props.task.description
                                    ? taskIsComplete
                                        ? 0.5 // has description and is complete
                                        : 0.9 // has description and is NOT complete
                                    : taskIsComplete
                                    ? 0.5 // DOESN'T have description and is complete
                                    : 0.7, // DOESN'T have description and is NOT complete
                            }}
                        >
                            {props.task.description || "(No Task Description Provided)"}
                        </Typography>
                        {"children" in props.task && props.task.children.length > 0 && (
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
                                                task={subtask}
                                                containerId={`subtask-${subtask.id}-container`}
                                                containerStyle={{ display: "flex" }}
                                                iconContainerId={`subtask-${subtask.id}-icon-container`}
                                                iconContainerClass={`subtask-icon-container ${
                                                    subtask.completedAt === null
                                                        ? "incomplete"
                                                        : "completed"
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
