'use client'

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import DeleteAction from "../delete-action";
import { DropdownMenu, DropdownMenuGroup, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { CircleEllipsis, MoreHorizontal, Pencil, Trash } from "lucide-react";

interface Props {
    id: string;
    module: string;
    apiUrl: string;
    onSuccess?: () => void;
}

export default function ViewListActions({ id, module, apiUrl, onSuccess }: Props) {
    const [open, setOpen] = useState<boolean>(false);

    const onSuccessSubmit = () => {
        setOpen(false);
        if (onSuccess) {
            onSuccess();
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className='h-8 w-8 p-0'>
                        <MoreHorizontal className='h-4 w-4' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    <DropdownMenuGroup>
                        <Link href={`/dashboard/${module}/${id}`}>
                            <DropdownMenuItem><CircleEllipsis />Detalles</DropdownMenuItem>
                        </Link>
                        <Link href={`/dashboard/${module}/edit?id=${id}`}>
                            <DropdownMenuItem><Pencil />Editar</DropdownMenuItem>
                        </Link>
                        <DialogTrigger className="w-full">
                            <DropdownMenuItem><Trash />Eliminar</DropdownMenuItem>
                        </DialogTrigger>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            <DeleteAction apiUrl={apiUrl} moduleName={module} id={id} onSuccess={onSuccessSubmit} />
        </Dialog>
    );
}