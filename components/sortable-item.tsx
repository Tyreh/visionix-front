"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface SortableBoardProps {
    id: string;
    children: React.ReactNode;
}

export default function SortableBoard({ id, children }: SortableBoardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id,
        handle: true, // Solo el handle activa el drag
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <div className="flex items-center gap-2">
                <GripVertical
                    className="w-4 h-4 cursor-grab text-muted-foreground"
                    {...attributes}
                    {...listeners} // Solo permite arrastrar desde aquí
                />
                {children}
            </div>
        </div>
    );
}
