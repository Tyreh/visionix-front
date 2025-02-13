import { UseDataTableInput, UseGetTableResponseType } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useData = <TData>(
    identifier: string,
    getAllRecordsFn: (params: UseDataTableInput) => Promise<UseGetTableResponseType<TData>>,
    { sorting, columnFilters, pagination }: UseDataTableInput
) => {
    const { data: allData, isLoading: isAllDataLoading } = useQuery<UseGetTableResponseType<TData>, AxiosError>({
        queryKey: [identifier, sorting, columnFilters, pagination],
        queryFn: () => getAllRecordsFn({ sorting, columnFilters, pagination })
    });

    return { allData, isAllDataLoading };
}