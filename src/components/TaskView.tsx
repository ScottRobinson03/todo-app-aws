import { useState } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
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
        { id: 1, title: "Task #1", description: "Description of Task #1" },
        { id: 2, title: "Task #2", description: "Description of Task #2" },
        { id: 3, title: "Task #3", description: "Description of Task #3" },
        { id: 4, title: "Task #4", description: "Description of Task #4" },
        { id: 5, title: "Task #5", description: "Description of Task #5" },
    ];
    const [tasks, setTasks] = useState<Task[]>(tasksJson);
    const [activeTask, setActiveTask] = useState<ActiveTaskState>(null);

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

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (active === null || over === null) {
            console.log("Either active or over was null:");
            console.log(`Active: ${active} | Over: ${over}`);
            return;
        }

        if (active.id === over.id) {
            // Didn't move the task, so assume they're trying to open it
            setActiveTask(activeTask === +active.id ? null : +active.id);
            console.log(`Toggled task ${active.id}`);
            return;
        }

        // Did move the task, so update accordingly
        setTasks(tasks => {
            const oldIndex = tasks.findIndex(task => active.id === task.id);
            const newIndex = tasks.findIndex(task => over.id === task.id);

            console.log(
                `Moved ${active.id} over ${over.id}. Moving from index ${oldIndex} to ${newIndex}`
            );

            return arrayMove(tasks, oldIndex, newIndex);
        });
    }
}
