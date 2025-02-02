"use client"

import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { secureFetch } from "@/secure-fetch";
import { IconX } from "@tabler/icons-react";
import { Pen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
    apiUrl: string;
    noteId: string;
}

export default function DeleteReminder({ apiUrl, noteId }: Props) {
    const { toast } = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    async function handleDelete(noteId: string) {
        setLoading(true);
        const response = await secureFetch(`${apiUrl}/note/${noteId}`, {
            method: 'DELETE',
        });

        if (response.status === 200) {
            router.refresh();
            toast({
                title: '🗑️ Nota eliminada',
                description: 'La nota ha sido eliminada correctamente.'
            })
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className={`${buttonVariants({ 'variant': 'ghost' })} w-full`}>
                <IconX className="h-3 w-3" /> Eliminar
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>¿Deseas borrar esta nota?</DialogTitle>
                    <DialogDescription>
                        Si la eliminas, no podrás recuperarla. ¿Estás seguro?
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    {!loading && <DialogClose>Cancelar</DialogClose>}
                    <Button type="submit" loading={loading} onClick={() => handleDelete(noteId)}>Eliminar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}