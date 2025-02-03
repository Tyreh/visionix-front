"use client";

import { useState } from "react";
import { DndContext, rectIntersection, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Ellipsis, Pencil } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import SortableItem from "@/components/sortable-item";
import SortableBoard from "@/components/sortable-board";
import KanbanCardForm from "./kanban-card-form";
import { Separator } from "@/components/ui/separator";

interface CardData {
    id: string;
    title: string;
    description: string;
    indexOrder: number;
    createdAt: string;
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

    function handleDragEnd(event: any) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        let newBoards = [...boardsWithCards];

        // Mover tableros
        const boardIndex = newBoards.findIndex(board => board.id === activeId);
        const overBoardIndex = newBoards.findIndex(board => board.id === overId);

        if (boardIndex !== -1 && overBoardIndex !== -1) {
            setBoardsWithCards(arrayMove(newBoards, boardIndex, overBoardIndex));
            return;
        }

        // Mover tarjetas
        const sourceBoardIndex = newBoards.findIndex(board =>
            board.cards.some(card => card.id === activeId)
        );

        const destinationBoardIndex = newBoards.findIndex(board =>
            board.id === overId || board.cards.some(card => card.id === overId)
        );

        if (sourceBoardIndex === -1 || destinationBoardIndex === -1) return;

        const sourceBoard = newBoards[sourceBoardIndex];
        const destinationBoard = newBoards[destinationBoardIndex];

        // Remover la tarjeta del tablero original
        const cardIndex = sourceBoard.cards.findIndex(card => card.id === activeId);
        if (cardIndex === -1) return;

        const [movedCard] = sourceBoard.cards.splice(cardIndex, 1);

        // Si la tarjeta se suelta sobre otra, insertar en esa posición
        const overCardIndex = destinationBoard.cards.findIndex(card => card.id === overId);

        if (overCardIndex !== -1) {
            destinationBoard.cards.splice(overCardIndex + 1, 0, movedCard);
        } else {
            // Si se suelta en un espacio vacío dentro del tablero, agregarla al final
            destinationBoard.cards.push(movedCard);
        }

        // Actualizar el estado con los nuevos datos
        setBoardsWithCards([...newBoards]);
    }


    return (
        <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragEnd={handleDragEnd}>
            <SortableContext items={boardsWithCards} strategy={horizontalListSortingStrategy}>
                <ScrollArea className="w-full max-w-full overflow-x-auto relative">
                    <div className="flex gap-4 p-2 pb-10">
                        {boardsWithCards.map((board) => (
                            <SortableBoard key={board.id} id={board.id}>
                                <Card className="w-80 flex-shrink-0 min-h-[400px]">
                                    <CardHeader className="flex flex-row justify-between items-center py-2">
                                        <div className="flex items-center gap-2">
                                            <CardTitle className="text-muted-foreground uppercase text-sm font-normal">
                                                {board.title}
                                            </CardTitle>
                                        </div>
                                        <Button variant="ghost" size="icon"><Pencil className="w-4 h-4" /></Button>
                                    </CardHeader>
                                    <Separator className="mb-2" />
                                    <CardContent className='flex flex-col gap-4 p-2'>
                                        <SortableContext items={board.cards} strategy={verticalListSortingStrategy}>
                                            {board.cards.map((card) => (
                                                <SortableItem key={card.id} id={card.id}>
                                                    <Dialog>
                                                        <DialogTrigger className="p-2 w-full rounded-md border bg-background shadow-sm hover:bg-accent">
                                                            {card.title}
                                                        </DialogTrigger>
                                                    </Dialog>
                                                </SortableItem>
                                            ))}
                                        </SortableContext>
                                        <KanbanCardForm apiUrl={apiUrl} kanbanBoardId={board.id} />
                                    </CardContent>
                                </Card>
                            </SortableBoard>
                        ))}
                    </div>
                </ScrollArea>
            </SortableContext>
        </DndContext>
    );
}
