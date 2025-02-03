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
import { Pen, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton";
import FormInput from "@/components/ui/form/form-input";

const formSchema = z.object({
    id: z.string(),
    indexOrder: z.number(),
    title: z.string({ required_error: "Este campo es obligatorio" }).min(1, "Este campo es obligatorio").max(40, "Este campo no puede tener más de 40 caracteres")
});

interface Props {
    apiUrl: string;
    id?: string;
}

export default function KanbanBoardForm({ apiUrl, id }: Props) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: "",
            indexOrder: 0,
            title: ""
        },
        reValidateMode: "onBlur",
        mode: "onBlur"
    })

    const [loading, setLoading] = useState<boolean>(false);
    const [loadingData, setLoadingData] = useState<boolean>(false);
    const router = useRouter();
    const { toast } = useToast();
    const [open, setOpen] = useState<boolean>(false);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        const response = await secureFetch(`${apiUrl}/kanban-board${id ? `/${id}` : ''}`, {
            method: id ? 'PATCH' : 'POST',
            body: JSON.stringify({
                ...(id ? { id: id } : {}),
                indexOrder: values.indexOrder,
                title: values.title
            })
        });

        if (response.status === 200) {
            router.refresh();
            toast({
                title: '🎉 ¡Todo listo!',
                description: 'Tu nuevo tablero está listo para usarse. Agrega tareas y empieza a moverlas entre columnas.'
            })
            form.reset();
            setOpen(false);
        } else {
            toast({
                variant: "destructive",
                title: '¡Ups!',
                description: response.message
            })
        }
        setLoading(false);
    }

    async function fetchData() {
        setLoadingData(true);
        const response = await secureFetch(`${apiUrl}/note/${id}`);
        form.setValue("id", response.data.id);
        form.setValue("title", response.data.title);
        setLoadingData(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className={`${buttonVariants({ 'variant': 'default', 'size': 'icon' })}`}>
                <Plus className="h-4 w-4" />
            </DialogTrigger>
            <DialogContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>

                        <DialogHeader>
                            <DialogTitle>Crear Tablero</DialogTitle>
                            <DialogDescription>
                                Define un nombre y personaliza tu tablero
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            {loadingData ?
                                <Skeleton className="h-8 w-full" />
                                :
                                <FormInput name="title" label="Título del Tablero" control={form.control} props={{ disabled: loading }} />
                            }
                        </div>
                        <DialogFooter>

                            {loadingData ?
                                <React.Fragment>
                                    <Skeleton className="size-8" />
                                    <Skeleton className="size-8" />
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    {!loading && <DialogClose>Cancelar</DialogClose>}
                                    <Button type="submit" loading={loading}>Guardar</Button>
                                </React.Fragment>
                            }

                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}