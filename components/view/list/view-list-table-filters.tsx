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

export interface ViewListTableFilterFieldsProps {
    title: string,
    type: string,
    name: string,
    option: string,
    depend?: string
}

interface ViewListTableFiltersProps {
    moduleName: string;
    columns: ViewConfigField[];
    filterFields?: ViewListTableFilterFieldsProps[];
    filterData?: any;
    query: string;
    setQuery: (query: string) => void;
    layout: string | null;
    setLayout: (layout: string | null) => void;
    sortColumn: string | null;
    setSortColumn: (sortColumn: string | null) => void;
    sortOrder: string | null;
    setSortOrder: (sortOrder: string | null) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    setPage: (page: string) => void;
    isDesktop: boolean;
    updatePreference: (key: string, value: any) => void;

}

export const ViewListTableFilters = ({
    moduleName,
    columns,
    filterFields,
    filterData,
    query,
    setQuery,
    layout,
    setLayout,
    sortColumn,
    setSortColumn,
    sortOrder,
    setSortOrder,
    loading,
    updatePreference,
    isDesktop,
    setPage
}: ViewListTableFiltersProps) => {


    const handleSearch = useDebouncedCallback((value: string) => {
        setQuery(value);
        setPage("0");
        updatePreference(`${moduleName}-vlp`, "0");
        updatePreference(`${moduleName}-vlq`, value);
    }, 400);

    const handleLayoutChange = (newLayout: string) => {
        setLayout(newLayout);
        if (isDesktop) {
            updatePreference(`${moduleName}-vll`, newLayout);
        } else {
            updatePreference(`${moduleName}-vllm`, newLayout);
        }
    };


    const handleColumnOrderChange = (newColumn: string) => {
        setSortColumn(newColumn);
        updatePreference(`${moduleName}-vlsc`, newColumn);
        if (!sortOrder) {
            updatePreference(`${moduleName}-vls`, 'asc');
            setSortOrder('asc')
        };
    };

    const handleOrderChange = () => {
        if (sortOrder == 'asc') {
            setSortOrder('desc');
            updatePreference(`${moduleName}-vls`, 'desc');
        } else {
            setSortOrder('asc');
            updatePreference(`${moduleName}-vls`, 'asc');
        }
    };

    function renderFilterField(field: ViewListTableFilterFieldsProps) {
        if (field.type === 'combobox' && filterData?.[field.name]) {
            // const params = new URLSearchParams(searchParams);
            // Obtener las opciones específicas de 'filterData' según el nombre del campo
            const options = filterData[field.name];
            return (
                <Combobox
                    options={options}
                // onSelect={(value) => params.set(field.name, value)}
                // placeholder={`Selecciona ${field.title}`}
                />
            );
        }
        return null;
    }

    if (loading) {
        return null;
    }

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
                <div className="flex flex-nowrap">
                    <Button
                        size="icon"
                        variant={layout === "grid" ? "secondary" : "outline"}
                        onClick={() => handleLayoutChange("grid")}
                        className="rounded-e-none"
                    >
                        <IconLayoutGrid />
                    </Button>
                    <Button
                        size="icon"
                        variant={layout === "list" ? "secondary" : "outline"}
                        onClick={() => handleLayoutChange("list")}
                        className="rounded-s-none"
                    >
                        <IconLayoutList />
                    </Button>
                </div>

                <div className="flex flex-nowrap">
                    <Select onValueChange={(value) => handleColumnOrderChange(value)}>
                        <SelectTrigger className={sortColumn ? "rounded-e-none" : ""}>
                            <SelectValue placeholder="Ordenar por" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Ordenar por:</SelectLabel>
                                {Object.entries(columns)
                                    .filter(([_, fieldMetadata]) => fieldMetadata.sortable)
                                    .map(([key, fieldMetadata]) => <SelectItem key={fieldMetadata.sortKey || key} value={fieldMetadata.sortKey || key}>{fieldMetadata.label}</SelectItem>)
                                }

                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {sortColumn &&
                        <Button size="icon" variant="outline" className="rounded-s-none" onClick={() => handleOrderChange()}>
                            {sortOrder === 'desc' ? <IconSortDescending2 /> : <IconSortAscending2 />}
                        </Button>
                    }
                </div>
                {/* {filterFields &&
                    <div className="flex flex-nowrap">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="rounded-e-none">
                                    <IconFilter />Filtros
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Filtros</SheetTitle>
                                    <SheetDescription>
                                        En este menú podrás aplicar filtros adicionales para mejorar tu búsqueda de registros.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="grid gap-4 py-4">
                                    {filterFields.map(field => (
                                        <div key={field.name} className="grid grid-cols-4 items-center gap-4">
                                            <Label className="text-right">{field.title} {field.name}</Label>
                                            {renderFilterField(field)}
                                        </div>
                                    ))}
                                </div>
                                <SheetFooter>
                                    <Button variant="outline">Limpiar</Button>
                                    <SheetClose asChild>
                                        <Button type="submit">Aplicar</Button>
                                    </SheetClose>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                        <Button size="icon" variant="outline" className="rounded-s-none">
                            <IconX />
                        </Button>
                    </div>
                } */}
            </div>
        </div>

    );
}