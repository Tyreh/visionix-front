import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { secureFetch } from "@/secure-fetch";
import KanbanBoardForm from "./kanban-board-form";
import Kanban from "./kanban";

interface Props {
    apiUserId: string;
}

export default async function KanbanMain({ apiUserId }: Props) {
    const boards = await secureFetch(`${process.env.API_URL}/kanban-board/search?apiUserId=${apiUserId}`);
    const boardsWithCards = await Promise.all(boards.data.map(async (board) => {
        const cards = await secureFetch(`${process.env.API_URL}/kanban-card/search?kanbanBoardId=${board.id}&apiUserId=${apiUserId}`);
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
            </CardHeader>
            <CardContent>
                <Kanban boards={boardsWithCards} apiUrl={process.env.API_URL || ""} />
            </CardContent>
        </Card>
    );
}
