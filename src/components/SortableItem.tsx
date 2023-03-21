import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableItemProps } from "../types";
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SyntheticEvent } from "react";

export function SortableItem(props: SortableItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: props.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: "5px",
    };

    function handleChange(_: SyntheticEvent, isExpanded: boolean) {
        const newActiveTask = isExpanded ? props.id : null;
        console.log(`Setting active task to ${newActiveTask}`);
        props.setActiveTask(newActiveTask);
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Accordion
                sx={{ backgroundColor: "lightgrey" }}
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
                            color: "text.secondary",
                            width: "5%",
                            flexShrink: 0,
                            boxSizing: "border-box",
                            textAlign: "center",
                            alignContent: "center",
                        }}
                    >
                        #{props.id}
                    </Typography>
                    <Typography sx={{ textAlign: "center", marginRight: "3%", width: "100%" }}>
                        {props.title}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>{props.description}</Typography>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}
