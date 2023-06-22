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
import { SortableItem } from "./SortableItem";
import { ActiveTaskState, TaskViewProps } from "../types";

export default function TaskView(props: TaskViewProps) {
    const {
        accountSignedIn,
        accountTasks,
        setAccountTasks,
        userTasks,
        setUserTasks,
        deleteTask,
        updateTask,
    } = props;
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
                {/* TODO: Display a message when user has no tasks (instead of an empty task list which looks weird) */}
                <SortableContext
                    items={accountTasks.map(accountTask => {
                        return { id: accountTask.task_id, ...accountTask };
                    })}
                    strategy={verticalListSortingStrategy}
                >
                    {accountTasks.map(accountTask => {
                        // TODO: Distinguish between own tasks and tasks created by others that user can view
                        const userTask = userTasks.find(
                            userTask => userTask.id === accountTask.task_id
                        );
                        if (!userTask)
                            return (
                                <p key={`${accountTask.task_id}-usertask-not-found`}>
                                    Failed to find user task {`${accountTask.task_id}`}
                                </p>
                            );
                        return (
                            <SortableItem
                                key={`${accountTask.task_id}-sortable-item`}
                                {...{
                                    accountSignedIn,
                                    accountTask,
                                    accountTasks,
                                    setAccountTasks,
                                    activeTask,
                                    setActiveTask,
                                    userTask,
                                    userTasks,
                                    setUserTasks,
                                    deleteTask,
                                    updateTask,
                                }}
                            />
                        );
                    })}
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
        setAccountTasks(accountTasks => {
            console.log("Updating positions of accountTasks")
            const oldIndex = accountTasks.findIndex(accountTask => active.id === accountTask.task_id);
            const newIndex = accountTasks.findIndex(accountTask => over.id === accountTask.task_id);

            const newTasks = arrayMove(accountTasks, oldIndex, newIndex);
            // Update the `position` attribute of tasks that got shifted as a result of moving
            for (let i = Math.min(oldIndex, newIndex); i <= Math.max(oldIndex, newIndex); i++) {
                newTasks[i].position = i + 1;
            }
            props.updateAccount({ tasks: newTasks });
            return newTasks;
        });
    }
}
