import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { secureFetch } from "@/secure-fetch";
import KanbanBoardForm from "./kanban2/kanban-board-form";
import { KanbanBoard } from "@/components/kanban/kanban-board";

interface Props {
    apiUserId: string;
}

export default async function KanbanMain({ apiUserId }: Props) {
    const boards = await secureFetch(`${process.env.API_URL}/kanbanBoard/search?apiUserId=${apiUserId}`);
    const cards = await secureFetch(`${process.env.API_URL}/kanbanCard/search?apiUserId=${apiUserId}`);
    // const cardsOfBoards = await Promise.all(boards.data.map(async (board) => {
    //     const cards = await secureFetch(`${process.env.API_URL}/kanban-card/search?kanbanBoardId=${board.id}&apiUserId=${apiUserId}`);
    //     return { cards: cards.data };
    // }));


    return (
        <Card className="col-span-full">
            <CardHeader className="flex flex-1 flex-row justify-between items-center">
                <div>
                    <CardTitle>¡Toma el control de tu trabajo!</CardTitle>
                    <CardDescription>Organiza tus tareas de manera visual y eficiente</CardDescription>
                </div>
                <KanbanBoardForm apiUrl={process.env.API_URL || ""} />
            </CardHeader>
            <CardContent>
                <KanbanBoard boards={boards.data} cards={cards.data} apiUrl={process.env.API_URL || ""}/>
                {/* <Kanban boards={boardsWithCards} apiUrl={process.env.API_URL || ""} /> */}
            </CardContent>
        </Card>
    );
}
