'use client'

import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
} from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Props {
    page: string;
    pageSize: string;
    pages: number;
    setPage: (page: string) => void;
    setPageSize: (page: string) => void;
    updatePreference: (key: string, value: any) => void;
    moduleName: string;
}

export function ViewListPagination({ page, pageSize, setPage, setPageSize, pages, updatePreference, moduleName }: Props) {
    return (
        <div className="flex flex-row-reverse items-center justify-between px-2">
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Registros por página</p>
                    <Select value={pageSize} onValueChange={(value: string) => {
                        setPageSize(value);
                        updatePreference(`${moduleName}-vlps`, value);
                    }}>
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[25, 50, 75, 100].map(item => (
                                <SelectItem key={item} value={`${item}`}>
                                    {item}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium text-nowrap">
                    Página {pages === 0 ? '0' : parseInt(page) + 1} de{" "}
                    {pages}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => {
                            setPage("0");
                            updatePreference(`${moduleName}-vlp`, "0");
                        }}
                        disabled={parseInt(page) <= 0}
                    >
                        <span className="sr-only">Ir a la primera página</span>
                        <DoubleArrowLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                            setPage((parseInt(page) - 1).toString())
                            updatePreference(`${moduleName}-vlp`, (parseInt(page) - 1).toString());
                        }}
                        disabled={parseInt(page) <= 0}
                    >
                        <span className="sr-only">Regresar a la pagina anterior</span>
                        <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                            setPage((parseInt(page) + 1).toString())
                            updatePreference(`${moduleName}-vlp`, (parseInt(page) + 1).toString());
                        }}
                        disabled={parseInt(page) == (pages - 1) || pages == 0}
                    >
                        <span className="sr-only">Ir a la página siguiente</span>
                        <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => {
                            setPage((pages - 1).toString())
                            updatePreference(`${moduleName}-vlp`, (pages - 1).toString());
                        }}
                        disabled={parseInt(page) == (pages - 1) || pages == 0}
                    >
                        <span className="sr-only">Ir a la última página</span>
                        <DoubleArrowRightIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}