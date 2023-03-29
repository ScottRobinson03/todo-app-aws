import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useState } from "react";
import tasksJson from "../assets/tasks.json";
import { ActiveTaskState, Task } from "../types";
import { SortableItem } from "./SortableItem";

export default function TaskView() {
    const [tasks, setTasks] = useState<Task[]>(tasksJson);
    const [changedPos, setChangedPos] = useState<boolean>(false);
    const [activeTask, setActiveTask] = useState<ActiveTaskState>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: activeTask === null ? 50 : 3_600_000, // ms
                tolerance: 5, // px
            },
        })
    );

    return (
        <section id="task-container">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            >
                <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
                    {tasks.map(task => (
                        <SortableItem
                            key={task.id}
                            {...{ ...task, tasks, activeTask, setActiveTask, setTasks }}
                        />
                    ))}
                </SortableContext>
            </DndContext>
        </section>
    );

    function toggleActiveTask(taskId: string) {
        // Toggles the active task between `taskId` and null
        const newValue = activeTask === taskId ? null : taskId;
        setActiveTask(newValue);
    }

    function handleDragOver(event: DragOverEvent) {
        if (!event.over) {
            return;
        }
        if (event.active.id === event?.over.id) {
            // When you start dragging a task, it triggers a dragOver event
            // on itself which we don't want to count as changing position
            return;
        }
        // Ensure changedPos is true since we moved over a different item
        if (!changedPos) {
            setChangedPos(true);
        }
    }

    function handleDragEnd(event: DragEndEvent) {
        // Called whenever the user finishes dragging a task
        const { active, over } = event;

        if (active === null || over === null) {
            // Didn't move *at all*, so toggle
            toggleActiveTask(active.id.toString());
            return;
        }

        const targetParent = (event.activatorEvent.target as Element).parentElement;
        if (!targetParent) {
            // No parent so ignore
            return;
        }

        const targetParentName = targetParent.nodeName.toLowerCase();
        if (targetParentName === "section") {
            // Clicked on section so ignore
            return;
        } else if (targetParentName === "svg") {
            // We only want to toggle if the svg is the dropdown svg

            if (targetParent.classList.contains("MuiSvgIcon-root")) {
                // Clicked on the dropdown svg (we assume any mui icon is the dropdown icon)
                toggleActiveTask(active.id.toString());
            } else if (targetParent.id === "task-icon-completed" && activeTask !== active.id) {
                setActiveTask(active.id.toString());
            }
            return;
        }

        const targetClassName = targetParent.className;
        if (
            targetClassName &&
            (targetClassName.includes("MuiAccordionDetails") ||
                targetClassName.includes("MuiAccordion-region"))
        ) {
            // Clicked on task description so ignore
            return;
        }

        if (active.id === over.id) {
            // Did move task, but to same position

            if (!changedPos) {
                // Didn't at any point change the position, so toggle task
                toggleActiveTask(active.id.toString());
            } else {
                // Changed the position when dragging, so DON'T toggle task
                setChangedPos(false);
            }
            return;
        }

        // Moved task to different position, so update accordingly
        setChangedPos(false); // reset for the next drag
        setTasks(tasks => {
            const oldIndex = tasks.findIndex(task => active.id === task.id);
            const newIndex = tasks.findIndex(task => over.id === task.id);

            const newTasks = arrayMove(tasks, oldIndex, newIndex);
            // Update the `position` attribute of tasks that got shifted as a result of moving
            for (let i = Math.min(oldIndex, newIndex); i <= Math.max(oldIndex, newIndex); i++) {
                newTasks[i].position = i + 1;
            }
            return newTasks;
        });
    }
}
