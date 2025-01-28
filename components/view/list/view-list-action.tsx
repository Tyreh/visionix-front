import { Input } from "@/components/ui/input";
import { IconSearch } from "@tabler/icons-react";
import { useDebouncedCallback } from "use-debounce";

interface Props {
    singular: string;
    query: string;
    moduleName: string;
    setPage: (page: string) => void;
    updatePreference: (key: string, value: string) => void;
    setQuery: (query: string) => void;
}

export default function ViewListTableAction({ singular, query, moduleName, setPage, setQuery, updatePreference }: Props) {
    const handleSearch = useDebouncedCallback((value: string) => {
        setQuery(value);
        setPage("0");
        updatePreference(`${moduleName}-vlp`, "0");
        updatePreference(`${moduleName}-vlq`, value);
    }, 400);

    return (
        <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-grow w-full sm:w-fit">
                <Input
                    type="text"
                    placeholder={`Buscar ${singular}...`}
                    className="w-full pl-9 peer"
                    defaultValue={query}
                    onChange={(e) => {
                        handleSearch(e.target.value);
                    }}
                />
                <IconSearch className="h-4 w-4 absolute left-0 top-1/2 -translate-y-1/2 ms-2 text-muted-foreground peer-focus:text-gray-800" />
            </div>
        </div>
    );
}