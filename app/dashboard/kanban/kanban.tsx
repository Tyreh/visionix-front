"use client";

import { useState, useEffect } from "react";
import { DndContext, closestCorners, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { Card, CardTitle, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Ellipsis, Pencil, Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import SortableItem from "@/components/sortable-item";
import SortableBoard from "@/components/sortable-board";
import KanbanCardForm from "./kanban-card-form";

interface CardData {
    id: string;
    title: string;
    description: string;
    indexOrder: number;
}

interface Board {
    id: string;
    title: string;
    indexOrder: number;
    cards: CardData[];
}

export interface Props {
    boards: Board[];
    apiUrl: string;
}

export default function Kanban({ apiUrl, boards }: Props) {
    const [boardsWithCards, setBoardsWithCards] = useState<Board[]>(boards || []);

    // Sensores de drag & drop
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );

    // Función para manejar el movimiento de tableros y tarjetas
    function handleDragEnd(event: any) {
        const { active, over } = event;
        if (!over) return;

        // Mover tableros
        const boardIndex = boardsWithCards.findIndex(board => board.id === active.id);
        const overBoardIndex = boardsWithCards.findIndex(board => board.id === over.id);

        if (boardIndex !== -1 && overBoardIndex !== -1) {
            setBoardsWithCards(arrayMove(boardsWithCards, boardIndex, overBoardIndex));
            return;
        }

        // Mover tarjetas dentro del mismo tablero
        const boardWithCard = boardsWithCards.find(board =>
            board.cards.some(card => card.id === active.id)
        );

        if (!boardWithCard) return;

        const oldIndex = boardWithCard.cards.findIndex(card => card.id === active.id);
        const newIndex = boardWithCard.cards.findIndex(card => card.id === over.id);

        if (oldIndex !== newIndex) {
            boardWithCard.cards = arrayMove(boardWithCard.cards, oldIndex, newIndex);
            setBoardsWithCards([...boardsWithCards]);
        }
    }

    // Evitar renderizar si los datos no están listos
    if (!boardsWithCards || boardsWithCards.length === 0) {
        return <p className="text-center text-muted-foreground">Cargando tableros...</p>;
    }

    return (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <SortableContext items={boardsWithCards} strategy={horizontalListSortingStrategy}>
                <ScrollArea className="w-full max-w-full overflow-x-auto relative">
                    <div className="flex gap-4 p-2 pb-10">
                        {boardsWithCards.map((board) => (
                            <SortableBoard key={board.id} id={board.id}>
                                <Card className="w-80 flex-shrink-0 min-h-[400px]">
                                    <CardHeader className="flex flex-row justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            
                                            <CardTitle className="text-muted-foreground uppercase text-sm font-normal">
                                                {board.title}
                                            </CardTitle>
                                        </div>
                                        <Button variant="ghost" size="icon"><Pencil className="w-4 h-4" /></Button>
                                    </CardHeader>

                                    <CardContent className='flex flex-col gap-4 p-2'>
                                        <SortableContext items={board.cards} strategy={verticalListSortingStrategy}>
                                            {board.cards.map((card) => (
                                                <SortableItem key={card.id} id={card.id}>
                                                    <Dialog>
                                                        <DialogTrigger className="p-2 rounded-md border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground text-left">
                                                            
                                                                {card.title}
                                                        </DialogTrigger>
                                                    </Dialog>
                                                </SortableItem>
                                            ))}
                                        </SortableContext>
                                    </CardContent>
                                    <CardFooter>
                                        <KanbanCardForm apiUrl={apiUrl} kanbanBoardId={board.id} />
                                    </CardFooter>
                                </Card>
                            </SortableBoard>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" className="absolute bottom-0 w-full visible" />
                </ScrollArea>
            </SortableContext>
        </DndContext>
    );
}
