import { Card, CardTitle, CardDescription, CardHeader, CardContent } from "@/components/ui/card";
import KanbanForm from "./kanban-form";
import { secureFetch } from "@/secure-fetch";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
    apiUserId: string;
}

export default async function Kanban({ apiUserId }: Props) {
    const boards = await secureFetch(`${process.env.API_URL}/kanban-board/search?apiUserId=${apiUserId}`);
    const boardsWithCards = await Promise.all(boards.data.map(async (board) => {
        const cards = await secureFetch(`${process.env.API_URL}/kanban-card/search?kanbanBoardId=${board.id}&apiUserId=${apiUserId}`);
        return { ...board, cards: cards.data };
    }));

    return (
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle>¡Toma el control de tu trabajo!</CardTitle>
                <CardDescription>Organiza tus tareas de manera visual y eficiente</CardDescription>
            </CardHeader>
            <CardContent>
                {boardsWithCards.map((board, index) =>
                    <Card key={index}>
                        <CardHeader className="flex justify-between items-center">
                            <CardTitle>{board.title}</CardTitle>
                        </CardHeader>
                        <CardContent className='flex flex-grow flex-col gap-4 overflow-x-hidden p-2'>
                            {/* <ScrollArea className='h-full'>
                                <SortableContext items={tasksIds}>
                                    {board.cards.map((card) => (
                                        <TaskCard key={card.id} task={task} />
                                    ))}
                                </SortableContext>
                            </ScrollArea> */}
                        </CardContent>
                    </Card>
                )}
                <KanbanForm apiUrl={process.env.API_URL || ""} />
            </CardContent>
        </Card>
    );
}