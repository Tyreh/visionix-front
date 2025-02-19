'use client'
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EyeNoneIcon, CaretSortIcon } from "@radix-ui/react-icons";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import React from "react";
import { useState } from "react";

interface Props {
    fields: {
        showInList: boolean;
        sortable: boolean;
        field: string;
        label: string;
        sortKey?: string;
    }[];
    sortColumn: string | null;
    sortOrder: string | null;
    setSortOrder: (order: string) => void;
    setSortColumn: (column: string) => void;
    hiddenColumns: Set<string>;
    setHiddenColumns: (columns: Set<string>) => void;
    updatePreference: (key: string, value: any) => void;
    module: string;
}


export enum SortOrder {
    ASC = "asc",
    DESC = "desc"
}

export default function ViewListHeader({ fields, setSortColumn, setSortOrder, sortColumn, sortOrder, hiddenColumns, setHiddenColumns, module, updatePreference }: Props) {

    const handleSort = (column: string, order: SortOrder) => {
        setSortColumn(column);
        setSortOrder(order);
        updatePreference(`${module}-vlsc`, column);
        updatePreference(`${module}-vls`, order);
    };

    const toggleColumnVisibility = (column: string) => {
        setHiddenColumns(prev => {
            const newHidden = new Set(prev);
            if (newHidden.has(column)) {
                newHidden.delete(column);
            } else {
                newHidden.add(column);
            }
            return newHidden;
        });
    };
    

    return (
        <TableHeader>
            <TableRow>
                {fields
                    .filter((field) => field.showInList && !hiddenColumns.has(field.field))
                    .map((field) => (
                        <TableHead key={field.label}>
                            <div className="flex items-center space-x-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="-ml-3 h-8 data-[state=open]:bg-accent my-2 py-5 whitespace-nowrap"
                                        >
                                            {field.label}
                                            {sortColumn === (field.sortKey || field.field) && sortOrder === SortOrder.DESC ? (
                                                <ArrowDownIcon className="ml-2 h-4 w-4" />
                                            ) : sortColumn === (field.sortKey || field.field)  && sortOrder === SortOrder.ASC ? (
                                                <ArrowUpIcon className="ml-2 h-4 w-4" />
                                            ) : (
                                                <CaretSortIcon className="ml-2 h-4 w-4" />
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        {field.sortable &&
                                            <React.Fragment>
                                                <DropdownMenuItem onClick={() => handleSort(field.sortKey || field.field, SortOrder.ASC)}>
                                                    <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                                                    Orden Ascendente
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleSort(field.sortKey || field.field, SortOrder.DESC)}>
                                                    <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                                                    Orden Descendente
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                            </React.Fragment>
                                        }
                                        <DropdownMenuItem onClick={() => toggleColumnVisibility(field.field)}>
                                            <EyeNoneIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                                            Ocultar Columna
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </TableHead>
                    ))}
                <TableHead></TableHead>
            </TableRow>
        </TableHeader>
    );
}