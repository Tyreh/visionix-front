import { Button, buttonVariants } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import Link from "next/link";

interface Props {
    audits: any;
}

export default function AuditLog({ audits }: Props) {
    return (
        <Collapsible>
            <div className="flex items-center space-x-4">
                <h3 className="font-semibold">Registro de actividad</h3>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <ChevronsUpDown className="h-4 w-4" />
                    </Button>
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="p-6">
                {audits.map((record: never) => {
                    const eventLabels: { [key: string]: string } = {
                        create: 'creado',
                        update: 'actualizado',
                        delete: 'eliminado',
                    };

                    const eventLabel = eventLabels[record['event']] || 'acción desconocida';
                    const eventColor = record['event'] === 'create'
                        ? 'bg-green-500'
                        : record['event'] === 'update'
                            ? 'bg-blue-500'
                            : record['event'] === 'delete'
                                ? 'bg-red-500'
                                : 'bg-gray-500';

                    return (
                        <div
                            key={record['id']}
                            className={`after:absolute after:inset-y-0 after:w-px after:bg-gray-500/20 relative pl-6 after:left-0 grid gap-10 dark:after:bg-gray-400/20`}
                        >
                            <div className="grid gap-1 text-sm relative">
                                <div className={`aspect-square w-3 ${eventColor} rounded-full absolute left-0 translate-x-[-29.5px] z-10 top-1 dark:bg-gray-50`} />
                                <div className="font-medium">{record['date']}</div>
                                <div className="text-gray-500 dark:text-gray-400">
                                    El registro fue {eventLabel} por
                                    <Link href={`/public-profile/${record['user']['id']}`} className={`${buttonVariants({ variant: "link" })} p-0 m-0`}>
                                        {record['user']['name']} {record['user']['lastName']}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <p className="text-muted-foreground text-xs font-italic pt-4">Mostrando las últimas {audits.length} acciones registradas.</p>
            </CollapsibleContent>
        </Collapsible>
    );
}