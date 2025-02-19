import { Card, CardTitle, CardDescription, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import KanbanBoardForm from "./kanban-board-form";
import { secureFetch } from "@/secure-fetch";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Ellipsis, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import KanbanCardForm from "./kanban-card-form";

interface Props {
    apiUserId: string;
}

export default async function Kanban({ apiUserId }: Props) {
    const boards = await secureFetch(`${process.env.API_URL}/kanbanBoard/search?apiUserId=${apiUserId}`);
    const boardsWithCards = await Promise.all(boards.data.map(async (board) => {
        const cards = await secureFetch(`${process.env.API_URL}/kanbanCard/search?kanbanBoardId=${board.id}&apiUserId=${apiUserId}`);
        return { ...board, cards: cards.data };
    }));

    return (
        <Card className="col-span-full">
            <CardHeader className="flex flex-1 flex-row justify-between items-center">
                <div>
                    <CardTitle>¡Toma el control de tu trabajo!</CardTitle>
                    <CardDescription>Organiza tus tareas de manera visual y eficiente</CardDescription>
                </div>
                <KanbanBoardForm apiUrl={process.env.API_URL || ""} />
                {/* <Button size="icon"><Plus /></Button> */}

            </CardHeader>
            <CardContent>
                <ScrollArea className="w-full max-w-full overflow-x-auto relative">
                    <div className="flex gap-4 p-2 pb-10">
                        {boardsWithCards.map((board) => (
                            <Card key={board.id} className="w-80 flex-shrink-0 min-h-[400px]">
                                <CardHeader className="flex flex-1 flex-row justify-between items-center">
                                    <CardTitle className="text-muted-foreground uppercase text-sm font-normal">{board.title}</CardTitle>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger><Ellipsis /></DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            {/* <DropdownMenuLabel><ReminderForm apiUrl={process.env.API_URL || ""} id={note.id} /></DropdownMenuLabel> */}
                                            {/* <DropdownMenuLabel><DeleteReminder apiUrl={process.env.API_URL || ""} noteId={note.id} /></DropdownMenuLabel> */}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <Button size="sm" variant="secondary">
                                        <Ellipsis className="w-4 h-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent className='flex flex-col gap-4 p-2'>
                                    {board.cards.map((card) => (
                                        <Dialog key={card.id}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="w-full text-left">
                                                    {card.title}
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>{card.title}</DialogTitle>
                                                    <DialogDescription>{card.description}</DialogDescription>
                                                </DialogHeader>
                                            </DialogContent>
                                        </Dialog>
                                    ))}
                                </CardContent>
                                <CardFooter>
                                    <KanbanCardForm apiUrl={process.env.API_URL || ""}/>
                                    <Button className="w-full" variant="secondary"><Plus />Crear tarea</Button>
                                </CardFooter>
                            </Card>
                        ))}
                        
                    </div>
                    <ScrollBar orientation="horizontal" className="absolute bottom-0 w-full visible" />
                </ScrollArea>
            </CardContent>
        </Card>
    );
}