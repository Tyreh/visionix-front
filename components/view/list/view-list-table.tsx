'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ViewListTableFilters } from "@/components/view/list/ViewListTableFilters";
import { Card, CardContent } from "@/components/ui/card";
import { useMediaQuery } from "@react-hook/media-query";
import React, { useEffect, useState } from "react";
import { Atom } from "react-loading-indicators";
import { secureFetch } from "@/secure-fetch";
import { getNestedValue } from "@/lib/utils";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { ViewListPagination } from "./ViewListPagination";
import { redirect } from "next/navigation";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "@/components/ui/scroll-area";

interface Props {
    apiUrl: string;
    config: ViewConfigDefinition;
    data: any;
}

export interface ViewConfigField {
    id: string;
    entityFieldName: string;
    label: string;
    sortable: boolean,
    showInList: boolean,
    fieldType: string;
    layoutColumnSize?: number;
    displayOrder: number;
}


export interface ViewConfigDefinition {
    id: string;
    moduleName: string;
    singular: string;
    plural: string;
    fields: ViewConfigField[];
}


function renderColumnValue(column: ViewConfigField, value: any) {
    switch (column.fieldType) {
        case 'IMAGE':
            return <img src={value} alt="Imagen" width="50" />;
        case 'CURRENCY':
            // return `$${value.toFixed(2)}`;
            return `$${value}`;
        default:
            return value;
    }
}

// const usePreferences = (defaultPreferences) => {
//     const [preferences, setPreferences] = useState(defaultPreferences);

//     const updatePreference = (key, value) => {
//         setPreferences((prev) => {
//             const updatedPreferences = { ...prev };

//             if (value === "" || value === null || value === undefined) {
//                 // Si el valor está vacío, elimina la preferencia
//                 delete updatedPreferences[key];
//             } else {
//                 updatedPreferences[key] = value;
//             }

//             return updatedPreferences;
//         });
//     };

//     return { preferences, setPreferences, updatePreference };
// };

export default function ViewListTable({ data, config }: Props) {
    // const [loadingPage, setLoadingPage] = useState(true);
    // const [loading, setLoading] = useState(false);
    // const [query, setQuery] = useState("");
    // const [layout, setLayout] = useState<string | null>(null);
    // const [sortColumn, setSortColumn] = useState<string | null>(null);
    // const [sortOrder, setSortOrder] = useState<string | null>(null);
    // const [page, setPage] = useState("0");
    // const [pageSize, setPageSize] = useState("25");
    // const [pages, setPages] = useState(0);
    // const [data, setData] = useState([]);
    // const isDesktop = useMediaQuery("(min-width: 768px)");
    // const { preferences, setPreferences, updatePreference } = usePreferences({});

    // useEffect(() => {
    //     const fetchPreferences = async () => {
    //         setLoadingPage(true);
    //         const preferencesJson = await secureFetch(`${apiUrl}/account/preferences`);
    //         const fetchedPreferences = preferencesJson.preferences || {};
    //         setPreferences(fetchedPreferences);
    //         setQuery(fetchedPreferences[`${config.controllerEndpoint}-vlq`] || "");
    //         setLayout(isDesktop ? fetchedPreferences[`${config.controllerEndpoint}-vll`] || 'list' : fetchedPreferences[`${config.controllerEndpoint}-vllm`] || 'grid');
    //         setSortColumn(fetchedPreferences[`${config.controllerEndpoint}-vlsc`] || null);
    //         setSortOrder(fetchedPreferences[`${config.controllerEndpoint}-vls`] || null);
    //         setPage(fetchedPreferences[`${config.controllerEndpoint}-vlp`] || "0");
    //         setPageSize(fetchedPreferences[`${config.controllerEndpoint}-vlps`] || "25");
    //         setLoadingPage(false);
    //     };

    //     fetchPreferences();
    // }, [apiUrl, config.controllerEndpoint]);

    // const updatePreferences = async () => {
    //     await secureFetch(`${apiUrl}/account/preferences`, {
    //         method: "PUT",
    //         body: JSON.stringify({ preferences }),
    //     });
    // }

    // const fetchData = async () => {
    //     setLoading(true);
    //     updatePreferences();

    //     let url = `${apiUrl}/${config.controllerEndpoint}/search?`;
    //     url += `page=${page}&`;
    //     url += `size=${pageSize}&`;
    //     if (query) url += `query=${query}&`;
    //     if (sortColumn) url += `sort=${sortColumn},${sortOrder}&`;

    //     const data = await secureFetch(url);
    //     setData(data.content);
    //     setPages(data.totalPages);
    //     setLoading(false);
    // };

    // useEffect(() => {
    //     if (!loadingPage) {
    //         updatePreferences();
    //     }
    // }, [layout])

    // useEffect(() => {
    //     if (!loadingPage) {
    //         fetchData();
    //     }
    // }, [apiUrl, config.controllerEndpoint, query, sortColumn, sortOrder, pageSize, page, loadingPage]);

    // const headerComponent: JSX.Element = (
    //     <div className="flex flex-col sm:flex-row justify-between items-center">
    //         <h3 className="text-xl font-semibold pb-5 sm:pb-0">Lista de {config.plural}</h3>
    //         <div className="flex flex-nowrap space-x-4 justify-between items-center w-full sm:w-fit">
    //             <Button variant={"secondary"} size="icon" onClick={() => fetchData()} ><RefreshCcw /></Button>
    //             <Link href={`/${config.controllerEndpoint}/edit`} className={buttonVariants({ variant: 'default' })}>Crear {config.singular}</Link>
    //         </div>
    //     </div>
    // );

    // const filtersComponent: JSX.Element = (
    //     <ViewListTableFilters
    //         moduleName={config.controllerEndpoint}
    //         columns={config.fields}
    //         query={query}
    //         setQuery={setQuery}
    //         layout={layout}
    //         setLayout={setLayout}
    //         sortColumn={sortColumn}
    //         setSortColumn={setSortColumn}
    //         sortOrder={sortOrder}
    //         setSortOrder={setSortOrder}
    //         loading={loadingPage}
    //         setLoading={setLoading}
    //         isDesktop={isDesktop}
    //         setPage={setPage}
    //         updatePreference={updatePreference}
    //     // filterFields={filters}
    //     />
    // );

    // if (loading) {
    //     return (
    //         <React.Fragment>
    //             {headerComponent}
    //             {filtersComponent}
    //             <div className="flex justify-center items-center h-full">
    //                 <Atom color="#32cd32" size="large" text="Cargando..." textColor="" />
    //             </div>
    //         </React.Fragment>
    //     );
    // }

    // if (layout === 'list') {
    return (
        <React.Fragment>
            {/* {headerComponent} */}
            {/* {filtersComponent} */}
            <ScrollArea className="flex-1">

                <Table className="relative">
                    <TableHeader>
                        <TableRow>
                            {config.fields.filter(field => field.showInList).map(field =>
                                <TableHead key={field.entityFieldName} className="font-semibold">{field.label}</TableHead>
                            )}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data.map((item: any) =>
                            <TableRow key={item.id} onClick={() => redirect(`/${config.moduleName}/${item.id}`)}>
                                {config.fields.filter(field => field.showInList).map(field => {
                                    const value = getNestedValue(item, field.entityFieldName);
                                    return (
                                        <TableCell key={field.entityFieldName}>
                                            {/* {config.detailLinkColumn === column.name ? */}
                                            <Link
                                                className={`block w-full h-full`}
                                                href={`/${config.moduleName}/${item.id}`}>{renderColumnValue(field, value)}</Link>
                                            {/* : */}
                                            {/* renderColumnValue(column, value) */}
                                            {/* } */}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <ScrollBar orientation="horizontal"/>
            </ScrollArea>

            <div className="rounded-md border">

            </div>
            {/* {(!loading && !loadingPage) &&
                <ViewListPagination moduleName={config.controllerEndpoint} updatePreference={updatePreference} page={page} pageSize={pageSize} pages={pages} setPage={setPage} setPageSize={setPageSize} />
            } */}
        </React.Fragment>
    );
    // } else {
    //     return (
    //         <React.Fragment>
    //             {/* {headerComponent} */}
    //             {/* {filtersComponent} */}
    //             <div className="grid grid-cols-1 xl:grid-cols-4 gap-9">
    //                 {data.map((item: any) =>
    //                     <Link href={`/${config.controllerEndpoint}/${item.id}`} key={item.id}>
    //                         <Card className="transition-transform transform hover:scale-105">
    //                             <CardContent className="flex flex-col">
    //                                 {config.fields.filter(field => field.showInList).map(field => {
    //                                     const value = getNestedValue(item, field.entityFieldName);
    //                                     return (
    //                                         <div key={field.entityFieldName} className="flex flex-col">
    //                                             <h3 className="font-semibold col-span-full pt-4">{field.label}</h3>
    //                                             <div>{renderColumnValue(field, value)}</div>
    //                                         </div>
    //                                     );
    //                                 })}
    //                             </CardContent>
    //                         </Card>
    //                     </Link>
    //                 )}
    //             </div>

    //             {(!loading && !loadingPage) &&
    //                 <ViewListPagination moduleName={config.controllerEndpoint} updatePreference={updatePreference} page={page} pageSize={pageSize} pages={pages} setPage={setPage} setPageSize={setPageSize} />
    //             }
    //         </React.Fragment>
    //     );
    // }
}