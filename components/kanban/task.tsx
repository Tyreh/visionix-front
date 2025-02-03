"use client"

// src/components/Task.tsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const Task = ({ task }) => {
  const { id, content } = task;

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
    data: {
      type: "task",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-white p-2 rounded shadow">
      {content}
    </div>
  );
};