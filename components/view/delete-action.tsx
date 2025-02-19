'use client'

import { Button, buttonVariants } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { secureFetch } from "@/secure-fetch";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
    apiUrl: string;
    moduleName: string;
    id: string;
    onSuccess?: () => void;
}

export default function DeleteAction({ apiUrl, moduleName, id, onSuccess }: Props) {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const { toast } = useToast();

    const confirmDelete = async () => {
        setLoading(true);
        const response = await secureFetch(`${apiUrl}/${moduleName}/${id}`, { method: "DELETE" });

        if (response.status === 200) {
            toast({
                title: '🗑️ Registro eliminado',
                description: 'El registro ha sido eliminado correctamente.'
            })
            router.push(`/dashboard/${moduleName}`);
            if (onSuccess) {
                onSuccess();
            }
        } else {
            toast({
                variant: "destructive",
                title: '¡Ups!',
                description: response.message
            })
        }
    };

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>¿Estás absolutamente seguro?</DialogTitle>
                <DialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente este registro.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                {!loading && <DialogClose className={buttonVariants({ 'variant': 'secondary' })}>Cancelar</DialogClose>}
                <Button loading={loading} onClick={() => confirmDelete()}>Eliminar</Button>
            </DialogFooter>
        </DialogContent>
    );
}