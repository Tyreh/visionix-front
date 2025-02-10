'use client'
import Link from "next/link";
import { redirect } from "next/navigation";
import { ColumnDef } from '@tanstack/react-table';
import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table";
import { CircleEllipsis, MoreHorizontal, Pencil, CircleMinus, Trash } from 'lucide-react'
import { DataTableColumnHeader } from "@/components/data-table/data-table-header";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import DeleteAction from "./[id]/delete-action";
import { useState } from "react";


interface MetadataField {
    showInList: boolean;
    label: string;
    type: string;
    nestedValue?: string;
}

interface Metadata {
    fields: Record<string, MetadataField>;
    entity: {
        plural: string;
        singular: string;
    };
}

interface DataItem {
    [key: string]: any;
}


interface Props {
    rawColumns: any;
    rawData: any;
    module: string;
    apiUrl: string;
}

export default function ViewTable({ rawColumns, rawData, module, apiUrl }: Props) {

    function getColumnsFromMetadata(metadata: Metadata): ColumnDef<DataItem>[] {
        const columns = Object.entries(metadata.fields)
            .filter(([_, field]) => field.showInList)
            .map(([key, field]) => ({
                accessorKey: key,
                header: ({ column }) => (
                    <DataTableColumnHeader column={column} title={field.label} />
                ),
                cell: ({ row }) => {
                    const value = row.getValue(key);

                    // Manejar imágenes
                    if (field.type === 'IMAGE' && typeof value === 'string') {
                        return <img src={value} alt={field.label} className="h-10 w-10 object-cover" />;
                    }

                    // Manejar valores anidados usando nestedValue
                    if (field.nestedValue && typeof value === 'object' && value !== null) {
                        return <div>{value[field.nestedValue] || 'N/A'}</div>;
                    }

                    return <div>{value}</div>;
                }
            }));

        columns.push({
            accessorKey: "actions",
            header: () => <div></div>,
            cell: ({ row }) => {
                const rowData = row.original;
                return (
                    <Dialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant='ghost' className='h-8 w-8 p-0'>
                                    <MoreHorizontal className='h-4 w-4' />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                                <DropdownMenuGroup>
                                    <Link href={`/dashboard/${module}/${rowData.id}`}>
                                        <DropdownMenuItem><CircleEllipsis />Detalles</DropdownMenuItem>
                                    </Link>
                                    <Link href={`/dashboard/${module}/edit?id=${rowData.id}`}>
                                        <DropdownMenuItem><Pencil />Editar</DropdownMenuItem>
                                    </Link>
                                    <DialogTrigger className="w-full">
                                        <DropdownMenuItem><Trash />Eliminar</DropdownMenuItem>
                                    </DialogTrigger>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DeleteAction apiUrl={apiUrl} moduleName={module} id={rowData.id} />
                    </Dialog>
                );
            }
        });

        return columns;
    }

    const [data, setData] = useState<any[]>([]);
    const [co]


 

    const columns = getColumnsFromMetadata(rawColumns);
    const data = rawData;

    return (
        <DataTable columns={columns} data={data} />
    );
}
