"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import { useEffect, useState } from "react";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useDebouncedCallback } from "use-debounce";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowDownIcon, ArrowUpIcon, CaretSortIcon, EyeNoneIcon } from "@radix-ui/react-icons";

import { getNestedValue } from "@/lib/utils";
import { secureFetch } from "@/secure-fetch";
import { Input } from "@/components/ui/input";
import { IconSearch } from "@tabler/icons-react";
import { ViewRelationPagination } from "./view-relation-pagination";

enum SortOrder {
    ASC = "asc",
    DESC = "desc"
}

interface Field {
    field: string;
    label: string;
    showInList: boolean;
    sortable: boolean;
    nestedValue?: string;
    sortKey?: string;
}

interface Entity {
    singular: string;
    plural: string;
    mainField?: string;
}

interface Metadata {
    fields: Field[];
    entity: Entity;
}

interface Props {
    apiUrl: string;
    module: string;
    trigger: React.ReactNode;
    onSelect: (selectedItem: any) => void;
}

export default function ViewRelationListTable({ apiUrl, module, trigger, onSelect }: Props) {
    const [loading, setLoading] = useState<boolean>(false);
    const [query, setQuery] = useState<string>("");
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<string | null>(null);
    const [page, setPage] = useState<number>(0);
    const [pages, setPages] = useState(0);
    const [data, setData] = useState([]);
    const [metadata, setMetadata] = useState<Metadata>();
    const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
    const [open, setOpen] = useState<boolean>(false);

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

    const handleSort = (column: string, order: SortOrder) => {
        setSortColumn(column);
        setSortOrder(order);
    };

    const handleSearch = useDebouncedCallback(async (value: string) => {
        setQuery(value);
        setPages(0);
        setPage(0);

    }, 500);

    useEffect(() => {
        const fetchInitData = async () => {
            setLoading(true);
            let endpoint = `${apiUrl}/${module}/search?`;
            if (query !== "") endpoint += `query=${query}&`;
            if (sortColumn && sortOrder) endpoint += `sort=${sortColumn},${sortOrder}&`;
            endpoint += `page=${page}&`;
            const response = await secureFetch(endpoint);
            setMetadata(response.metadata);
            setData(response.data.content);
            setPage(response.data.pageable.pageNumber);
            setPages(response.data.totalPages);
            setLoading(false);
        }
        fetchInitData();

    }, [apiUrl, module, sortColumn, sortOrder, query, page, pages])

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>{trigger}</SheetTrigger>
            <SheetContent side="bottom" className="max-h-[80vh] h-[80vh]">
                <SheetHeader>
                    <SheetTitle>Buscar {metadata?.entity.singular}</SheetTitle>
                    <SheetDescription>
                        Busca un registro en la lista y haz tu elección. ¡No te quedes mirando!
                    </SheetDescription>
                </SheetHeader>

                <div className="py-4 flex flex-col sm:flex-row justify-between items-center w-full sm:space-y-0 space-y-4 sm:space-x-4">
                    <div className="relative flex-grow w-full sm:w-fit">
                        <Input
                            type="text"
                            placeholder="Buscar..."
                            className="w-full pl-9 peer"
                            defaultValue={query}
                            onChange={(e) => {
                                handleSearch(e.target.value);
                            }}
                        />
                        <IconSearch className="h-4 w-4 absolute left-0 top-1/2 -translate-y-1/2 ms-2 text-muted-foreground peer-focus:text-gray-800" />
                    </div>
                    <ViewRelationPagination page={page} pages={pages} setPage={setPage} />

                </div>
                <div className="overflow-y-auto max-h-[60vh]">
                    {loading ?
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <TableHead key={index}>
                                            <Skeleton className="h-4 w-full" />
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Array.from({ length: 10 }).map((_, index) => (
                                    <TableRow key={index}>
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <TableCell key={index}><Skeleton className="h-4 w-full" /></TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        :
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {metadata?.fields
                                        .filter((field: Field) => field.showInList && !hiddenColumns.has(field.field))
                                        .map((field: Field) => (
                                            <TableHead key={field.label}>
                                                <div className="flex items-center space-x-2">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="-ml-3 h-8 data-[state=open]:bg-accent text-wrap my-2 py-5"
                                                            >
                                                                {field.label}
                                                                {sortColumn === (field.sortKey || field.field) && sortOrder === SortOrder.DESC ? (
                                                                    <ArrowDownIcon className="ml-2 h-4 w-4" />
                                                                ) : sortColumn === (field.sortKey || field.field) && sortOrder === SortOrder.ASC ? (
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
                            <TableBody>
                                {data.map((item: any) =>
                                    <TableRow key={item.id}>
                                        {metadata?.fields?.filter(field => field.showInList && !hiddenColumns.has(field.field)).map(field => {
                                            const nestedPath = field.nestedValue || field.field;
                                            const fieldValue = getNestedValue(item, nestedPath);
                                            return (
                                                <TableCell key={`${item.id}-${field.field}`}>
                                                    {fieldValue}
                                                </TableCell>
                                            )
                                        })}
                                        <TableCell>
                                            <Button size="sm" onClick={() => {
                                                onSelect({ value: item.id, label: getNestedValue(item, metadata?.entity.mainField || item.id) })
                                                setOpen(false)
                                            }}
                                            >
                                                Seleccionar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table >
                    }

                </div>
            </SheetContent>
        </Sheet >
    );
}