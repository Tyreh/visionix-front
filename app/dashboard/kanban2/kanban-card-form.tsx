"use client"

import { Button, buttonVariants } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
    DialogFooter
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form";
import FormTextArea from "@/components/ui/form/form-text-area";
import { secureFetch } from "@/secure-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { EllipsisVertical, Pen, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton";
import FormInput from "@/components/ui/form/form-input";
import FormInputMarkdown from "@/components/ui/form/form-input-markdown";
import "easymde/dist/easymde.min.css";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UniqueIdentifier } from "@dnd-kit/core";

const formSchema = z.object({
    id: z.string(),
    kanbanBoardId: z.string(),
    indexOrder: z.number(),
    title: z.string({ required_error: "Este campo es obligatorio" }).min(1, "Este campo es obligatorio").max(200, "Este campo no puede tener más de 40 caracteres"),
    description: z.string({ required_error: "Este campo es obligatorio" }).min(1, "Este campo es obligatorio")
});

interface Props {
    apiUrl: string;
    id?: UniqueIdentifier;
    kanbanBoardId: UniqueIdentifier;
}

export default function KanbanCardForm({ apiUrl, id, kanbanBoardId }: Props) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: "",
            kanbanBoardId: "",
            indexOrder: 0,
            title: "",
            description: "",
        },
        reValidateMode: "onBlur",
        mode: "onBlur"
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [loadingData, setLoadingData] = useState<boolean>(false);
    const router = useRouter();
    const { toast } = useToast();
    const [open, setOpen] = useState<boolean>(false);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        const response = await secureFetch(`${apiUrl}/kanban-card${id ? `/${id}` : ''}`, {
            method: id ? 'PATCH' : 'POST',
            body: JSON.stringify({
                ...(id ? { id: id } : {}),
                indexOrder: values.indexOrder,
                kanbanBoard: { id: kanbanBoardId },
                title: values.title,
                description: values.description
            })
        });

        if (response.status === 200) {
            router.refresh();
            toast({
                title: '✍️ ¡Hecho, anotado y listo!',
                description: 'Organízala en tu tablero y mantén el progreso en marcha.'
            });
            form.reset();
            setOpen(false);
        } else {
            toast({
                variant: "destructive",
                title: '¡Ups!',
                description: response.message
            });
        }
        setLoading(false);
    }

    async function fetchData() {
        setLoadingData(true);
        const response = await secureFetch(`${apiUrl}/kanban-card/${id}`);
        form.setValue("id", response.data.id);
        form.setValue("title", response.data.title);
        form.setValue("description", response.data.description);
        form.setValue("kanbanBoardId", response.data.kanbanBoard.id);
        setLoadingData(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {id ?
                <DialogTrigger asChild>
                    <Button  onClick={() => fetchData()} variant="outline" size="sm" className="ml-auto">Ver más</Button>
                </DialogTrigger>
                :
                <DialogTrigger className={"flex justify-center items-center text-muted-foreground w-full hover:cursor-pointer hover:text-black"}>
                    <Plus className="h-4 w-4 me-2" />Crear tarea
                </DialogTrigger>
            }

            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>

                        <DialogHeader>
                            <DialogTitle>{id ? 'Detalles de Tarea' : 'Crear Tarea'}</DialogTitle>
                            <DialogDescription>
                                {id ? 'Visualiza y edita los detalles de tu tarea' : "¿Qué hay pa' hacer"}
                            </DialogDescription>
                        </DialogHeader>

                        <ScrollArea className="max-h-[60vh] overflow-y-auto my-4">
                            <div className="grid gap-4 mx-2">
                                {loadingData ?
                                    <Skeleton className="h-24 w-full" />
                                    :
                                    <FormTextArea name="title" label="Título o resumen de la tarea" control={form.control} props={{ disabled: loading }} />
                                }
                                {loadingData ?
                                    <Skeleton className="h-24 w-full" />
                                    :
                                    <FormInputMarkdown name="description" label="Descripción" form={form} />
                                }
                            </div>
                        </ScrollArea>

                        <DialogFooter className="pt-4">
                            {loadingData ?
                                <>
                                    <Skeleton className="size-8" />
                                    <Skeleton className="size-8" />
                                </>
                                :
                                <>
                                    {!loading && <DialogClose>Cancelar</DialogClose>}
                                    <Button type="submit" loading={loading}>Guardar</Button>
                                </>
                            }
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
