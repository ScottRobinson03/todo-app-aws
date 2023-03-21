import { useState } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
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
    const [activeTask, setActiveTask] = useState<ActiveTaskState>(null);
    const [shouldExpandAfter, setShouldExpandAfter] = useState<boolean>(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (
        <section id="task-container">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
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
        const newValue = activeTask === taskId ? null : taskId;
        setActiveTask(newValue);
        console.log(`Set activeTask to ${newValue}`);

        if (newValue === null && shouldExpandAfter === true) {
            // There's no active task so there's no longer a task to expand
            setShouldExpandAfter(false);
            console.log("Forcing shouldExpandAfter back to false");
        }
    }

    function handleDragStart(event: DragStartEvent) {
        // Called whenever the user starts dragging a task.
        // Even simply clicking on the element counts as dragging.

        if (activeTask === event.active.id) {
            // Task is currently expanded, so un-expand it whilst dragging (solves visual bug when large expanded content).
            // We also need to make sure we re-expand it after the user stops dragging it, so we set the shouldExpandAfter state.
            setActiveTask(null);
            setShouldExpandAfter(true);
        }
    }

    function handleDragEnd(event: DragEndEvent) {
        // Called whenever the user finishes dragging a task
        const { active, over } = event;

        if (active === null || over === null) {
            // Didn't move, so ensure shouldExpandAfter is false to prevent a 'double-toggle' here
            if (shouldExpandAfter) {
                setShouldExpandAfter(false);
                return;
            }
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
            console.log("Target class name is falsey so ignoring");
            console.log(targetParent);
        } else if (
            targetClassName.includes("MuiAccordionDetails") ||
            targetClassName.includes("MuiAccordion-region")
        ) {
            // Handle when clicking on task description
            setShouldExpandAfter(false); // will be true due to handleDragStart
            return;
        } else {
            console.log(targetParent);
        }

        if (active.id === over.id) {
            // Did move task, but to same position
            if (window.performance.now() - event.activatorEvent.timeStamp > 1_000) {
                // Task was pressed for a long amount of time, so don't toggle
                if (shouldExpandAfter) {
                    setActiveTask(+active.id);
                    setShouldExpandAfter(false);
                }
            } else if (!shouldExpandAfter) {
                toggleActiveTask(+active.id);
            } else {
                setShouldExpandAfter(false);
            }
            return;
        }

        // Moved task to different position, so update accordingly
        setTasks(tasks => {
            const oldIndex = tasks.findIndex(task => active.id === task.id);
            const newIndex = tasks.findIndex(task => over.id === task.id);

            console.log(
                `Moved ${active.id} over ${over.id}. Moving from index ${oldIndex} to ${newIndex}`
            );

            for (let i = Math.min(oldIndex, newIndex); i < tasks.length; i++) {
                let newPosition;
                if (i === oldIndex) {
                    newPosition = newIndex + 1;
                } else if (i === newIndex) {
                    if (newIndex > oldIndex) {
                        newPosition = (tasks[i].position ?? tasks[i].id) - 1;
                    } else {
                        newPosition = (tasks[i].position ?? tasks[i].id) + 1;
                    }
                } else if (i > oldIndex && i < newIndex) {
                    newPosition = (tasks[i].position ?? tasks[i].id) - 1;
                } else if (i > newIndex && i < oldIndex) {
                    newPosition = (tasks[i].position ?? tasks[i].id) + 1;
                } else if (i > newIndex && i > oldIndex) {
                    // Have gone through everything that could possibly change
                    break;
                }

                if (newPosition !== undefined) {
                    tasks[i].position = newPosition;
                }
            }

            if (shouldExpandAfter) {
                setActiveTask(+active.id);
                setShouldExpandAfter(false);
            }

            return arrayMove(tasks, oldIndex, newIndex);
        });
    }
}
