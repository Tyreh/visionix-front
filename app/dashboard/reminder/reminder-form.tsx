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

const formSchema = z.object({
    id: z.string(),
    content: z.string({ required_error: "Este campo es obligatorio" }).min(1, "Este campo es obligatorio")
});

interface Props {
    apiUrl: string;
    id?: string;
}

export default function ReminderForm({ apiUrl, id }: Props) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: "",
            content: ""
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
        const response = await secureFetch(`${apiUrl}/note${id ? `/${id}` : ''}`, {
            method: id ? 'PATCH' : 'POST',
            body: JSON.stringify({
                ...(id ? { id: id} : {}),
                content: values.content
            })
        });

        if (response.status === 200) {
            router.refresh();
            toast({
                title: '📌 ¡Nota creada!',
                description: 'Nunca olvides lo importante. Tu nota ya está guardada.'
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
        form.setValue("content", response.data.content);
        setLoadingData(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {id ?
                <DialogTrigger onClick={() => fetchData()} className={`${buttonVariants({ 'variant': 'ghost' })} w-full`}>
                    <Pen className="h-3 w-3" /> Editar
                </DialogTrigger>
                :
                <DialogTrigger className={buttonVariants({ 'variant': 'default', 'size': 'icon' })}><Plus /></DialogTrigger>
            }
            <DialogContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>

                        <DialogHeader>
                            <DialogTitle>Crear Nota o Recordatorio</DialogTitle>
                            <DialogDescription>
                                Recuerda que este espacio es visible únicamente para ti
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4">
                            {loadingData ?
                                <Skeleton className="h-20 w-full" />
                                :
                                <FormTextArea name="content" label="Contenido" control={form.control} props={{ disabled: loading }} />
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