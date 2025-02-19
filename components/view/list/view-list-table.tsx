'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ViewListTableFilters } from "@/components/view/list/view-list-table-filters";
import { useMediaQuery } from "@react-hook/media-query";
import React, { useEffect, useState } from "react";
import { secureFetch } from "@/secure-fetch";
import { getNestedValue, resolveRedirectPath } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CircleEllipsis, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { ViewListPagination } from "./view-list-pagination";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import DeleteAction from "@/components/view/delete-action";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ViewListHeader from "./view-list-header";
import { Skeleton } from "@/components/ui/skeleton";
import ViewListActions from "./view-list-actions";

interface TableProps {
    apiUrl: string;
    config: ViewConfigDefinition;
    currentPreferences: any;
}

export interface ViewConfigField {
    field: string;
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
    filters?: string[];
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

export default function ViewListTable({ apiUrl, config, currentPreferences }: TableProps) {
    // preferences
    const [query, setQuery] = useState<string>(currentPreferences?.[`${config.module}-vlq`] || "");
    const [sortColumn, setSortColumn] = useState<string | null>(currentPreferences?.[`${config.module}-vlsc`] || null);
    const [sortOrder, setSortOrder] = useState<string | null>(currentPreferences?.[`${config.module}-vls`] || null);
    const [pageSize, setPageSize] = useState<number>(currentPreferences?.[`${config.module}-vlps`] || 25);
    const [page, setPage] = useState<number>(currentPreferences?.[`${config.module}-vlp`] || 0);
    const { preferences, setPreferences, updatePreference } = usePreferences(currentPreferences || {});
    // preferences
    const [metadata, setMetadata] = useState<{ fields?: any[] }>({});
    const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
    const [pages, setPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const fetchData = async () => {
        setLoading(true);
        await secureFetch(`${apiUrl}/account/preferences`, {
            method: "PUT",
            body: JSON.stringify({ preferences }),
        });
        let endpoint = `${apiUrl}/${config.module}/search?`;
        if (query !== "") endpoint += `query=${query}&`;
        if (sortColumn && sortOrder) endpoint += `sort=${sortColumn},${sortOrder}&`;
        endpoint += `size=${pageSize}&`;
        endpoint += `page=${page}&`;
        const response = await secureFetch(endpoint);
        setData(response.data.content);
        setMetadata(response.metadata);
        setPage(response.data.pageable.pageNumber);
        setPages(response.data.totalPages);
        setPageSize(response.data.size);
        setLoading(false);
    }
    
    useEffect(() => {
        fetchData();
    }, [apiUrl, config.module, sortOrder, sortColumn, query, page, pageSize])

    return (
        <div className='flex flex-1 flex-col space-y-4'>
            <ViewListTableFilters
                moduleName={config.module}
                query={query}
                setQuery={setQuery}
                loading={loading}
                setPage={setPage}
                updatePreference={updatePreference}
                filters={config.entity.filters}
                apiUrl={apiUrl}
            />

            <div className='relative flex flex-1'>
                <div className='absolute bottom-0 left-0 right-0 top-0 flex overflow-scroll rounded-md border md:overflow-auto'>
                    <ScrollArea className="flex-1">
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
                            <Table className="relative">
                                <ViewListHeader
                                    module={config.module}
                                    updatePreference={updatePreference}
                                    fields={metadata.fields || []}
                                    setSortColumn={setSortColumn}
                                    setSortOrder={setSortOrder}
                                    sortColumn={sortColumn}
                                    sortOrder={sortOrder}
                                    hiddenColumns={hiddenColumns}
                                    setHiddenColumns={setHiddenColumns}
                                />

                                <TableBody>
                                    {data.map((item: any) =>
                                        <TableRow key={item.id}>
                                            {config.fields.filter(field => field.showInList && !hiddenColumns.has(field.field)).map(field => {
                                                const nestedPath = field.nestedValue || field.field;
                                                const fieldValue = getNestedValue(item, nestedPath);
                                                const redirectPath = field.redirect ? resolveRedirectPath(field.redirect, item) : null;
                                                return (
                                                    <TableCell key={`${item.id}-${field.field}`}>
                                                        {redirectPath ? (
                                                            <Link className="text-primary hover:text-opacity-90 hover:underline" href={`/dashboard/${redirectPath}`}>
                                                                {fieldValue}
                                                            </Link>
                                                        ) : (
                                                            fieldValue
                                                        )}
                                                    </TableCell>
                                                )
                                            })}
                                            <TableCell>
                                                <ViewListActions
                                                    id={item.id}
                                                    module={config.module}
                                                    apiUrl={apiUrl}
                                                    onSuccess={() => fetchData()}
                                                />
                                                {/* <Dialog>
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
                                                </Dialog> */}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        }
                        <ScrollBar orientation='horizontal' />
                    </ScrollArea>
                </div>

            </div>
            <ViewListPagination moduleName={config.module} updatePreference={updatePreference} page={page} pageSize={pageSize} pages={pages} setPage={setPage} setPageSize={setPageSize} />


        </div>

        // {(!loading && !loadingPage) &&
        //     <ViewListPagination moduleName={config.module} updatePreference={updatePreference} page={page} pageSize={pageSize} pages={pages} setPage={setPage} setPageSize={setPageSize} />
        // }

    );


    // if (loading) {
    //     return (
    //         <React.Fragment>
    //             {headerComponent}
    //             {filtersComponent}
    //             <div className="flex justify-center items-center h-full">
    //                 Cargando...
    //             </div>
    //         </React.Fragment>
    //     );
    // }



    // if (layout === 'list') {
    //     return (
    //         <React.Fragment>
    //             {headerComponent}
    //             {filtersComponent}

    //             <div className="rounded-md border">
    //                 <Table>
    //                     <TableHeader>
    //                         <TableRow>
    //                             {config?.fields
    //                                 .filter((field) => field.showInList && !hiddenColumns.has(field.field))
    //                                 .map((field) => (
    //                                     <TableHead key={field.label}>
    //                                         <div className="flex items-center space-x-2">
    //                                             <DropdownMenu>
    //                                                 <DropdownMenuTrigger asChild>
    //                                                     <Button
    //                                                         variant="ghost"
    //                                                         size="sm"
    //                                                         className="-ml-3 h-8 data-[state=open]:bg-accent text-wrap my-2 py-5"
    //                                                     >
    //                                                         {field.label}
    //                                                         {sortColumn === field.field && sortOrder === SortOrder.DESC ? (
    //                                                             <ArrowDownIcon className="ml-2 h-4 w-4" />
    //                                                         ) : sortColumn === field.field && sortOrder === SortOrder.ASC ? (
    //                                                             <ArrowUpIcon className="ml-2 h-4 w-4" />
    //                                                         ) : (
    //                                                             <CaretSortIcon className="ml-2 h-4 w-4" />
    //                                                         )}
    //                                                     </Button>
    //                                                 </DropdownMenuTrigger>
    //                                                 <DropdownMenuContent align="start">
    //                                                     {field.sortable &&
    //                                                         <React.Fragment>
    //                                                             <DropdownMenuItem onClick={() => handleSort(field.sortKey || field.field, SortOrder.ASC)}>
    //                                                                 <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
    //                                                                 Orden Ascendente
    //                                                             </DropdownMenuItem>
    //                                                             <DropdownMenuItem onClick={() => handleSort(field.sortKey || field.field, SortOrder.DESC)}>
    //                                                                 <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
    //                                                                 Orden Descendente
    //                                                             </DropdownMenuItem>
    //                                                             <DropdownMenuSeparator />
    //                                                         </React.Fragment>
    //                                                     }
    //                                                     <DropdownMenuItem onClick={() => toggleColumnVisibility(field.field)}>
    //                                                         <EyeNoneIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
    //                                                         Ocultar Columna
    //                                                     </DropdownMenuItem>
    //                                                 </DropdownMenuContent>
    //                                             </DropdownMenu>
    //                                         </div>
    //                                     </TableHead>
    //                                 ))}
    //                             <TableHead></TableHead>
    //                         </TableRow>
    //                     </TableHeader>
    //                     <TableBody>
    //                         {data.map((item: any) =>
    //                             <TableRow key={item.id}>
    //                                 {config.fields.filter(field => field.showInList).map(field => {
    //                                     const nestedPath = field.nestedValue || field.field;
    //                                     const fieldValue = getNestedValue(item, nestedPath);
    //                                     const redirectPath = field.redirect ? resolveRedirectPath(field.redirect, item) : null;
    //                                     return (
    //                                         <TableCell key={`${item.id}-${field.field}`}>
    //                                             {redirectPath ? (
    //                                                 <Link className="text-primary hover:text-opacity-90 hover:underline" href={`/dashboard/${redirectPath}`}>
    //                                                     {fieldValue}
    //                                                 </Link>
    //                                             ) : (
    //                                                 fieldValue
    //                                             )}
    //                                         </TableCell>
    //                                     )
    //                                 })}
    //                                 <TableCell>
    //                                     <Dialog>
    //                                         <DropdownMenu>
    //                                             <DropdownMenuTrigger asChild>
    //                                                 <Button variant='ghost' className='h-8 w-8 p-0'>
    //                                                     <MoreHorizontal className='h-4 w-4' />
    //                                                 </Button>
    //                                             </DropdownMenuTrigger>
    //                                             <DropdownMenuContent align='end'>
    //                                                 <DropdownMenuGroup>
    //                                                     <Link href={`/dashboard/${config.module}/${item.id}`}>
    //                                                         <DropdownMenuItem><CircleEllipsis />Detalles</DropdownMenuItem>
    //                                                     </Link>
    //                                                     <Link href={`/dashboard/${config.module}/edit?id=${item.id}`}>
    //                                                         <DropdownMenuItem><Pencil />Editar</DropdownMenuItem>
    //                                                     </Link>
    //                                                     <DialogTrigger className="w-full">
    //                                                         <DropdownMenuItem><Trash />Eliminar</DropdownMenuItem>
    //                                                     </DialogTrigger>
    //                                                 </DropdownMenuGroup>
    //                                             </DropdownMenuContent>
    //                                         </DropdownMenu>
    //                                         <DeleteAction apiUrl={apiUrl} moduleName={config.module} id={item.id} />
    //                                     </Dialog>
    //                                 </TableCell>
    //                             </TableRow>
    //                         )}
    //                     </TableBody>
    //                 </Table>
    //             </div>
    //             {(!loading && !loadingPage) &&
    //                 <ViewListPagination moduleName={config.module} updatePreference={updatePreference} page={page} pageSize={pageSize} pages={pages} setPage={setPage} setPageSize={setPageSize} />
    //             }
    //         </React.Fragment>
    //     );
    // } else {
    //     return (
    //         <React.Fragment>
    //             {headerComponent}
    //             {filtersComponent}
    //             <div className="grid grid-cols-1 xl:grid-cols-4 gap-9">
    //                 {data.map((item: any) =>
    //                     <Link href={`/dashboard/${config.module}/${item.id}`} key={item.id}>
    //                         <Card className="transition-transform transform hover:scale-105">
    //                             <CardContent className="flex flex-col py-4">
    //                                 {config.fields.filter(field => field.showInList).map(field => {
    //                                     const nestedPath = field.nestedValue || field.field;
    //                                     const fieldValue = getNestedValue(item, nestedPath);
    //                                     const redirectPath = field.redirect ? resolveRedirectPath(field.redirect, item) : null;
    //                                     return (
    //                                         <div key={`${item.id}-${field.field}`} className="col-span-1">
    //                                             <Label className="font-semibold">{field.label}</Label>
    //                                             <div className="rounded-lg px-3 py-2 bg-muted mt-2 break-words whitespace-normal h-10">
    //                                                 {redirectPath ? (
    //                                                     <Link className="text-primary hover:text-opacity-90 hover:underline" href={`/dashboard/${redirectPath}`}>{fieldValue}</Link>
    //                                                 ) : (
    //                                                     fieldValue
    //                                                 )}
    //                                             </div>
    //                                         </div>
    //                                     );
    //                                 })}
    //                                 {/* {Object.entries(config.fields)
    //                                     .filter(([_, fieldMetadata]) => fieldMetadata.showInList)
    //                                     .map(([key, fieldMetadata]) => {
    //                                         const nestedPath = fieldMetadata.nestedValue || key;
    //                                         const fieldValue = getNestedValue(item, nestedPath);
    //                                         const redirectPath = fieldMetadata.redirect ? resolveRedirectPath(fieldMetadata.redirect, item) : null;

    //                                         return (
    //                                             <div key={key} className="col-span-1">
    //                                                 <Label className="font-semibold">{fieldMetadata.label}</Label>
    //                                                 <div className="rounded-lg px-3 py-2 bg-muted mt-2 break-words whitespace-normal h-10">
    //                                                     {redirectPath ? (
    //                                                         <Link className="text-primary hover:text-opacity-90 hover:underline" href={`/dashboard/${redirectPath}`}>{fieldValue}</Link>
    //                                                     ) : (
    //                                                         fieldValue
    //                                                     )}
    //                                                 </div>
    //                                             </div>
    //                                         );
    //                                     })
    //                                 } */}
    //                             </CardContent>
    //                         </Card>
    //                     </Link>
    //                 )}
    //             </div>

    //             {(!loading && !loadingPage) &&
    //                 <ViewListPagination moduleName={config.module} updatePreference={updatePreference} page={page} pageSize={pageSize} pages={pages} setPage={setPage} setPageSize={setPageSize} />
    //             }
    //         </React.Fragment>
    //     );
    // }
}