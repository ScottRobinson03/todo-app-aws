import { useState } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragOverEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { ActiveTaskState, Task } from "../types";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";

export default function TaskView() {
    const tasksJson = [
        {
            id: 1,
            title: "Task #1",
            description:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis unde odio atque culpa magni dolores accusantium. Eius ipsum nobis perferendis libero architecto nihil blanditiis voluptatum, exercitationem quas eos molestiae beatae\nConsequuntur maxime, numquam, totam esse nesciunt quisquam quibusdam nihil consequatur maiores reprehenderit vero perspiciatis mollitia id quidem ut molestias obcaecati quos illo adipisci ex fuga. Commodi adipisci possimus ratione consequatur.",
        },
        { id: 2, title: "Task #2", description: "Description of Task #2" },
        { id: 3, title: "Task #3", description: "Description of Task #3" },
        { id: 4, title: "Task #4", description: "Description of Task #4" },
        { id: 5, title: "Task #5", description: "Description of Task #5" },
    ];
    const [tasks, setTasks] = useState<Task[]>(tasksJson);
    const [changedPos, setChangedPos] = useState<boolean>(false);
    const [activeTask, setActiveTask] = useState<ActiveTaskState>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: activeTask === null ? 50 : 3_600_000, // ms
                tolerance: 5, // px
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
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
                        <SortableItem key={task.id} {...{ ...task, activeTask, setActiveTask }} />
                    ))}
                </SortableContext>
            </DndContext>
        </section>
    );

    function toggleActiveTask(taskId: Task["id"]) {
        // Toggles the active task between `taskId` and null
        const newValue = activeTask === taskId ? null : taskId;
        setActiveTask(newValue);
        console.log(`Set activeTask to ${newValue}`);
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
            console.log("changedPos set to true");
        }
    }

    function handleDragEnd(event: DragEndEvent) {
        // Called whenever the user finishes dragging a task
        const { active, over } = event;

        if (active === null || over === null) {
            // Didn't move *at all*, so toggle
            toggleActiveTask(+active.id);
            return;
        }

        const targetParent = (event.activatorEvent.target as Element).parentElement;
        if (!targetParent) {
            console.log("No parent so ignoring");
            return;
        }

        const targetParentName = targetParent.nodeName.toLowerCase();
        if (targetParentName === "section") {
            console.log("Clicked on section so ignoring");
            return;
        } else if (targetParentName === "svg") {
            console.log("Clicked on svg so toggling");
            toggleActiveTask(+active.id);
            return;
        }

        const targetClassName = targetParent.className;
        if (!targetClassName) {
            console.log("Target class name is falsey so ignoring", targetParent);
        } else if (
            targetClassName.includes("MuiAccordionDetails") ||
            targetClassName.includes("MuiAccordion-region")
        ) {
            // Handle when clicking on task description
            return;
        } else {
            console.log(targetParent);
        }

        if (active.id === over.id) {
            // Did move task, but to same position

            if (!changedPos) {
                // Didn't at any point change the position, so toggle task
                toggleActiveTask(+active.id);
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

            console.log(
                `Moved ${active.id} over ${over.id}. Moving from index ${oldIndex} to ${newIndex}`
            );

            const newTasks = arrayMove(tasks, oldIndex, newIndex);
            // Update the `position` attribute of tasks that got shifted as a result of moving
            for (let i = Math.min(oldIndex, newIndex); i < newTasks.length; i++) {
                newTasks[i].position = i + 1;
            }
            return newTasks;
        });
    }
}
