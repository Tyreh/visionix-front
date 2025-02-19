'use client'

import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
} from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"

interface Props {
    page: number;
    pages: number;
    setPage: (page: number) => void;
}

export function ViewRelationPagination({ page, setPage, pages }: Props) {
    return (
        <div className="flex flex-row-reverse items-center justify-between px-2">
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex w-[100px] items-center justify-center text-sm font-medium text-nowrap">
                    Página {pages === 0 ? '0' : page + 1} de{" "}
                    {pages}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => setPage(0)}
                        disabled={page <= 0}
                    >
                        <span className="sr-only">Ir a la primera página</span>
                        <DoubleArrowLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => setPage((page - 1))}
                        disabled={page <= 0}
                    >
                        <span className="sr-only">Regresar a la pagina anterior</span>
                        <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => setPage((page + 1))}
                        disabled={page == (pages - 1) || pages == 0}
                    >
                        <span className="sr-only">Ir a la página siguiente</span>
                        <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => setPage(pages - 1)}
                        disabled={page == (pages - 1) || pages == 0}
                    >
                        <span className="sr-only">Ir a la última página</span>
                        <DoubleArrowRightIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}