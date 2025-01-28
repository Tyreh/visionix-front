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
    updatePreference: (key: string, value: string) => void;
    moduleName: string;
    totalItems: number;
}

export function ViewListPagination({ page, pageSize, setPage, setPageSize, pages, updatePreference, moduleName, totalItems }: Props) {

    return (
        <div className='flex flex-col items-center justify-end gap-2 space-x-2 py-2 sm:flex-row'>
            <div className='flex w-full items-center justify-between'>
                <div className='flex-1 text-sm text-muted-foreground'>
                    {totalItems > 0 ? (
                        <>
                            Mostrando{' '}
                            {Number(page) * Number(pageSize) + 1} a{' '}
                            {Math.min(
                                (Number(page) + 1) * Number(pageSize),
                                totalItems
                            )}{' '}
                            de {totalItems} registros
                        </>
                    ) : (
                        'No se encontró ningún registro'
                    )}
                </div>
                <div className='flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8'>
                    <div className='flex items-center space-x-2'>
                        <p className='whitespace-nowrap text-sm font-medium'>
                            Registros por página
                        </p>
                        <Select value={pageSize} onValueChange={(value: string) => {
                            setPageSize(value);
                            updatePreference(`${moduleName}-vlps`, value);
                        }}>
                            <SelectTrigger className='h-8 w-[70px]'>
                                <SelectValue placeholder={pageSize} />
                            </SelectTrigger>
                            <SelectContent side='top'>
                                {[25, 50, 75, 100].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
            <div className='flex w-full items-center justify-between gap-2 sm:justify-end'>
                <div className='flex w-[150px] items-center justify-center text-sm font-medium'>
                    {totalItems > 0 ? (
                        <>
                            Página {page + 1} de {pages}
                        </>
                    ) : (
                        'No hay más páginas'
                    )}
                </div>
                <div className='flex items-center space-x-2'>
                    <Button
                        aria-label='Go to first page'
                        variant='outline'
                        className='hidden h-8 w-8 p-0 lg:flex'
                        onClick={() => {
                            setPage("0");
                            updatePreference(`${moduleName}-vlp`, "0");
                        }}
                        disabled={parseInt(page) <= 0}
                    >
                        <DoubleArrowLeftIcon className='h-4 w-4' aria-hidden='true' />
                    </Button>
                    <Button
                        aria-label='Go to previous page'
                        variant='outline'
                        className='h-8 w-8 p-0'
                        onClick={() => {
                            setPage((parseInt(page) - 1).toString())
                            updatePreference(`${moduleName}-vlp`, (parseInt(page) - 1).toString());
                        }}
                        disabled={parseInt(page) <= 0}
                    >
                        <ChevronLeftIcon className='h-4 w-4' aria-hidden='true' />
                    </Button>
                    <Button
                        aria-label='Go to next page'
                        variant='outline'
                        className='h-8 w-8 p-0'
                        onClick={() => {
                            setPage((parseInt(page) + 1).toString())
                            updatePreference(`${moduleName}-vlp`, (parseInt(page) + 1).toString());
                        }}
                        disabled={parseInt(page) == (pages - 1) || pages == 0}
                    >
                        <ChevronRightIcon className='h-4 w-4' aria-hidden='true' />
                    </Button>
                    <Button
                        aria-label='Go to last page'
                        variant='outline'
                        className='hidden h-8 w-8 p-0 lg:flex'
                        onClick={() => {
                            setPage((pages - 1).toString())
                            updatePreference(`${moduleName}-vlp`, (pages - 1).toString());
                        }}
                        disabled={parseInt(page) == (pages - 1) || pages == 0}
                    >
                        <DoubleArrowRightIcon className='h-4 w-4' aria-hidden='true' />
                    </Button>
                </div>
            </div>
        </div>
    );
}