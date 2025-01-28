'use client'

import React, { useEffect, useState } from "react";
import ViewListTableAction from "./view-list-action";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import ViewListTable from "./view-list-table";
import { ViewListPagination } from "./view-list-pagination";
import { useMediaQuery } from "@react-hook/media-query";
import { usePreferences } from "@/hooks/use-preferences";
import { secureFetch } from "@/secure-fetch";

export interface ViewConfigDefinition {
    id: string;
    moduleName: string;
    singular: string;
    plural: string;
    fields: ViewConfigField[];
}

export interface ViewConfigField {
    label: string;
    sortable: boolean;
    showInList: boolean;
}

interface Props {
    apiUrl: string;
    config: ViewConfigDefinition;
}

export default function ViewList({ apiUrl, config }: Props) {
    const [loading, setLoading] = useState<boolean>(false);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState("0");
    const [pageSize, setPageSize] = useState("25");
    const [pages, setPages] = useState(0);
    const [data, setData] = useState([]);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const { preferences, setPreferences, updatePreference } = usePreferences({});


    useEffect(() => {
        const fetchPreferences = async () => {
            const preferencesJson = await secureFetch(`${apiUrl}/account/preferences`);
            const fetchedPreferences = preferencesJson.preferences || {};
            setPreferences(fetchedPreferences);
            setQuery(fetchedPreferences[`${config.moduleName}-vlq`] || "");
            // setLayout(isDesktop ? fetchedPreferences[`${config.controllerEndpoint}-vll`] || 'list' : fetchedPreferences[`${config.controllerEndpoint}-vllm`] || 'grid');
            // setSortColumn(fetchedPreferences[`${config.controllerEndpoint}-vlsc`] || null);
            // setSortOrder(fetchedPreferences[`${config.controllerEndpoint}-vls`] || null);
            setPage(fetchedPreferences[`${config.moduleName}-vlp`] || "0");
            setPageSize(fetchedPreferences[`${config.moduleName}-vlps`] || "25");
        };
        fetchPreferences();
    }, [apiUrl, config.moduleName, setPreferences]);

    const updatePreferences = async () => {
        await secureFetch(`${apiUrl}/account/preferences`, {
            method: "PUT",
            body: JSON.stringify({ preferences }),
        });
    }

    const fetchData = async () => {
        setLoading(true);
        let url = `${apiUrl}/${config.moduleName}/search?`;
        url += `page=${page}&`;
        url += `size=${pageSize}&`;
        if (query) url += `query=${query}&`;
        //     // if (sortColumn) url += `sort=${sortColumn},${sortOrder}&`;
        const data = await secureFetch(url);
        setData(data.content);
        setPages(data.totalPages);
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
        updatePreferences();
    }, [apiUrl, config.moduleName, query, page, pageSize]);

    // const fetchData = async () => {
    //     setLoading(true);
    //     updatePreferences();

    //     let url = `${apiUrl}/${config.moduleName}/search?`;
    //     url += `page=${page}&`;
    //     url += `size=${pageSize}&`;
    //     if (query) url += `query=${query}&`;
    //     // if (sortColumn) url += `sort=${sortColumn},${sortOrder}&`;

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

    if (loading) {
        return (
            <React.Fragment>
                <ViewListTableAction moduleName={config.moduleName} singular={config.singular} query={query} setQuery={setQuery} setPage={setPage} updatePreference={updatePreference} />
                <TableSkeleton columnCount={config.fields.length} rowCount={ } />
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <ViewListTableAction moduleName={config.moduleName} singular={config.singular} query={query} setQuery={setQuery} setPage={setPage} updatePreference={updatePreference} />
            <div className="flex flex-1 flex-col space-y-4">
                <div className="relative flex flex-1">
                    <div className='absolute bottom-0 left-0 right-0 top-0 flex overflow-scroll rounded-md border md:overflow-auto'>
                        <ViewListTable data={data} config={config}/>
                    </div>
                </div>
                <ViewListPagination totalItems={data.length} moduleName={config.moduleName} setPageSize={setPageSize} page={page} setPage={setPage} pageSize={pageSize} updatePreference={updatePreference} pages={pages} />
            </div>
        </React.Fragment>
    );

}