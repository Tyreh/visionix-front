'use client'

import { IconLayoutGrid, IconLayoutList, IconSearch, IconSortAscending2, IconSortDescending2, IconX } from "@tabler/icons-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { useDebouncedCallback } from "use-debounce";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ViewConfigField } from "./ViewListTable";
import React from "react";
import { Combobox } from "@/components/ui/combobox";
import { getNestedValue } from "@/lib/utils";
import ViewRelationListTable from "../relation/view-relation-list-table";
import { ChevronsUpDown } from "lucide-react";

export interface ViewListTableFilterFieldsProps {
    title: string,
    type: string,
    name: string,
    option: string,
    depend?: string
}

interface ViewListTableFiltersProps {
    moduleName: string;
    query: string;
    setQuery: (query: string) => void;
    loading: boolean;
    setPage: (page: number) => void;
    updatePreference: (key: string, value: any) => void;
    filters?: string[];
    apiUrl: string;
}

export const ViewListTableFilters = ({
    moduleName,
    query,
    setQuery,
    loading,
    updatePreference,
    setPage,
    filters,
    apiUrl,
}: ViewListTableFiltersProps) => {

    const handleSearch = useDebouncedCallback(async (value: string) => {
        setQuery(value);
        setPage(0);
        updatePreference(`${moduleName}-vlp`, "0");
        updatePreference(`${moduleName}-vlq`, value);
    }, 500);


    // if (loading) {
    //     return null;
    // }

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center w-full sm:space-y-0 space-y-4 sm:space-x-4">
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


            <div className="flex flex-row items-center space-x-4">
     

                {filters && filters.map((filter, index) => (
                    <React.Fragment key={index}>
                        <ViewRelationListTable
                            apiUrl={apiUrl}
                            module={filter}
                            // onSelect={handleSelect}
                            trigger={
                                <Button
                                    variant="outline"
                                    className="w-full justify-between"
                                >
                                    {/* {field.value || 'Seleccionar...'} */}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            }
                        />
                    </React.Fragment>

                ))}
   
            </div>
        </div>

    );
}