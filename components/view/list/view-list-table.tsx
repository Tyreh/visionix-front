'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ViewListTableFilters } from "@/components/view/list/view-list-table-filters";
import { Card, CardContent } from "@/components/ui/card";
import { useMediaQuery } from "@react-hook/media-query";
import React, { useEffect, useState } from "react";
import { secureFetch } from "@/secure-fetch";
import { cn, getNestedValue, resolveRedirectPath } from "@/lib/utils";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { CircleEllipsis, MoreHorizontal, Pencil, Plus, RefreshCcw, Trash } from "lucide-react";
import { redirect } from "next/navigation";
import { ViewListPagination } from "./view-list-pagination";
import { Label } from "@/components/ui/label";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import DeleteAction from "@/app/dashboard/[module]/[id]/delete-action";

interface TableProps {
    apiUrl: string;
    config: ViewConfigDefinition;
}

export interface ViewConfigField {
    nestedValue: string;
    showInList: boolean;
    label: string;
    showInDetail: boolean;
    type: string;
    redirect?: string;
    sortable: boolean;
    sortKey?: string;
}

export interface ViewConfigEntity {
    plural: string;
    singular: string;
}


export interface ViewConfigDefinition {
    entity: ViewConfigEntity;
    module: string;
    fields: ViewConfigField[];
}


function renderColumnValue(column: ViewConfigField, value: any) {
    switch (column.type) {
        case 'IMAGE':
            return <img src={value} alt="Imagen" width="50" />;
        case 'CURRENCY':
            // return `$${value.toFixed(2)}`;
            return `$${value}`;
        default:
            return value;
    }
}

const usePreferences = (defaultPreferences) => {
    const [preferences, setPreferences] = useState(defaultPreferences);

    const updatePreference = (key, value) => {
        setPreferences((prev) => {
            const updatedPreferences = { ...prev };

            if (value === "" || value === null || value === undefined) {
                // Si el valor está vacío, elimina la preferencia
                delete updatedPreferences[key];
            } else {
                updatedPreferences[key] = value;
            }

            return updatedPreferences;
        });
    };

    return { preferences, setPreferences, updatePreference };
};

export default function ViewListTable({ apiUrl, config }: TableProps) {
    const [loadingPage, setLoadingPage] = useState(true);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState("");
    const [layout, setLayout] = useState<string | null>(null);
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<string | null>(null);
    const [page, setPage] = useState("0");
    const [pageSize, setPageSize] = useState("25");
    const [pages, setPages] = useState(0);
    const [data, setData] = useState([]);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const { preferences, setPreferences, updatePreference } = usePreferences({});

    useEffect(() => {
        const fetchPreferences = async () => {
            setLoadingPage(true);
            const preferencesJson = await secureFetch(`${apiUrl}/account/preferences`);
            const fetchedPreferences = preferencesJson.data.preferences || {};
            setPreferences(fetchedPreferences);
            setQuery(fetchedPreferences[`${config.module}-vlq`] || "");
            setLayout(isDesktop ? fetchedPreferences[`${config.module}-vll`] || 'list' : fetchedPreferences[`${config.module}-vllm`] || 'grid');
            setSortColumn(fetchedPreferences[`${config.module}-vlsc`] || null);
            setSortOrder(fetchedPreferences[`${config.module}-vls`] || null);
            setPage(fetchedPreferences[`${config.module}-vlp`] || "0");
            setPageSize(fetchedPreferences[`${config.module}-vlps`] || "25");
            setLoadingPage(false);
        };

        fetchPreferences();
    }, [apiUrl, config.module]);

    const updatePreferences = async () => {
        console.log(preferences)
        await secureFetch(`${apiUrl}/account/preferences`, {
            method: "PUT",
            body: JSON.stringify({ preferences }),
        });
    }

    const fetchData = async () => {
        setLoading(true);
        updatePreferences();

        let url = `${apiUrl}/${config.module}/search?`;
        url += `page=${page}&`;
        url += `size=${pageSize}&`;
        if (query) url += `query=${query}&`;
        if (sortColumn) url += `sort=${sortColumn},${sortOrder}&`;

        const response = await secureFetch(url);
        setData(response.data.content);
        setPages(response.data.totalPages);
        setLoading(false);
    };

    useEffect(() => {
        if (!loadingPage) {
            updatePreferences();
        }
    }, [layout])

    useEffect(() => {
        if (!loadingPage) {
            fetchData();
        }
    }, [apiUrl, config.module, query, sortColumn, sortOrder, pageSize, page, loadingPage]);

    const headerComponent: JSX.Element = (
        <div className="flex flex-col sm:flex-row justify-between items-center">
            <h3 className="font-semibold">Lista de {config.entity.plural}</h3>
            <div className="flex flex-nowrap space-x-4 justify-between items-center w-full sm:w-fit">
                <Button variant={"secondary"} size="icon" onClick={() => fetchData()} ><RefreshCcw /></Button>
                <Link href={`/dashboard/${config.module}/edit`} className={cn(buttonVariants({ "size": "sm" }), 'text-xs md:text-sm')}>
                    <Plus className='mr-2 h-4 w-4' /> Crear {config.entity.singular}
                </Link>
            </div>
        </div>
    );

    const filtersComponent: JSX.Element = (
        <ViewListTableFilters
            moduleName={config.module}
            columns={config.fields}
            query={query}
            setQuery={setQuery}
            layout={layout}
            setLayout={setLayout}
            sortColumn={sortColumn}
            setSortColumn={setSortColumn}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            loading={loadingPage}
            setLoading={setLoading}
            isDesktop={isDesktop}
            setPage={setPage}
            updatePreference={updatePreference}
        // filterFields={filters}
        />
    );

    if (loading) {
        return (
            <React.Fragment>
                {headerComponent}
                {filtersComponent}
                <div className="flex justify-center items-center h-full">
                    Cargando...
                </div>
            </React.Fragment>
        );
    }

    if (layout === 'list') {
        return (
            <React.Fragment>
                {headerComponent}
                {filtersComponent}

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {Object.values(config.fields).filter(field => field.showInList).map(field => (
                                    <TableHead key={field.label} className="font-semibold">{field.label}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {data.map((item: any) =>
                                <TableRow key={item.id} onClick={() => redirect(`/${config.module}/${item.id}`)}>
                                    {Object.entries(config.fields)
                                        .filter(([_, fieldMetadata]) => fieldMetadata.showInList)
                                        .map(([key, fieldMetadata]) => {
                                            const nestedPath = fieldMetadata.nestedValue || key;
                                            const fieldValue = getNestedValue(item, nestedPath);
                                            const redirectPath = fieldMetadata.redirect ? resolveRedirectPath(fieldMetadata.redirect, item) : null;

                                            return (
                                                <TableCell key={key}>
                                                    {redirectPath ? (
                                                        <Link className="text-primary hover:text-opacity-90 hover:underline" href={`/dashboard/${redirectPath}`}>
                                                            {fieldValue}
                                                        </Link>
                                                    ) : (
                                                        fieldValue
                                                    )}
                                                </TableCell>
                                            );
                                        })
                                    }
                                    <TableCell>
                                        <Dialog>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant='ghost' className='h-8 w-8 p-0'>
                                                        <MoreHorizontal className='h-4 w-4' />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align='end'>
                                                    <DropdownMenuGroup>
                                                        <Link href={`/dashboard/${config.module}/${item.id}`}>
                                                            <DropdownMenuItem><CircleEllipsis />Detalles</DropdownMenuItem>
                                                        </Link>
                                                        <Link href={`/dashboard/${config.module}/edit?id=${item.id}`}>
                                                            <DropdownMenuItem><Pencil />Editar</DropdownMenuItem>
                                                        </Link>
                                                        <DialogTrigger className="w-full">
                                                            <DropdownMenuItem><Trash />Eliminar</DropdownMenuItem>
                                                        </DialogTrigger>
                                                    </DropdownMenuGroup>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            <DeleteAction apiUrl={apiUrl} moduleName={config.module} id={item.id} />
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                {(!loading && !loadingPage) &&
                    <ViewListPagination moduleName={config.module} updatePreference={updatePreference} page={page} pageSize={pageSize} pages={pages} setPage={setPage} setPageSize={setPageSize} />
                }
            </React.Fragment>
        );
    } else {
        return (
            <React.Fragment>
                {headerComponent}
                {filtersComponent}
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-9">
                    {data.map((item: any) =>
                        <Link href={`/dashboard/${config.module}/${item.id}`} key={item.id}>
                            <Card className="transition-transform transform hover:scale-105">
                                <CardContent className="flex flex-col py-4">
                                    {Object.entries(config.fields)
                                        .filter(([_, fieldMetadata]) => fieldMetadata.showInList)
                                        .map(([key, fieldMetadata]) => {
                                            const nestedPath = fieldMetadata.nestedValue || key;
                                            const fieldValue = getNestedValue(item, nestedPath);
                                            const redirectPath = fieldMetadata.redirect ? resolveRedirectPath(fieldMetadata.redirect, item) : null;

                                            return (
                                                <div key={key} className="col-span-1">
                                                    <Label className="font-semibold">{fieldMetadata.label}</Label>
                                                    <div className="rounded-lg px-3 py-2 bg-muted mt-2 break-words whitespace-normal h-10">
                                                        {redirectPath ? (
                                                            <Link className="text-primary hover:text-opacity-90 hover:underline" href={`/dashboard/${redirectPath}`}>{fieldValue}</Link>
                                                        ) : (
                                                            fieldValue
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                </CardContent>
                            </Card>
                        </Link>
                    )}
                </div>

                {(!loading && !loadingPage) &&
                    <ViewListPagination moduleName={config.module} updatePreference={updatePreference} page={page} pageSize={pageSize} pages={pages} setPage={setPage} setPageSize={setPageSize} />
                }
            </React.Fragment>
        );
    }
}