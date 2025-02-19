"use client"

import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { secureFetch } from "@/secure-fetch";
import { IconSearch } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
    apiUrl: string;
}

interface Option {
    label: string;
    value: string;
}

export default function ProfileForm({ apiUrl }: Props) {
    const [query, setQuery] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [profiles, setProfiles] = useState<Option[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const response = await secureFetch(`${apiUrl}/account/profileComboList`);
            setProfiles(response.data);
            setLoading(false);
        }
        fetchData();
    }, [apiUrl])

    const handleSearch = (value: string) => {
        console.log("redirect");
        router.push(`/dashboard/account/profile/${value}`);
        router.refresh();
    }

    return (
        <div className="relative flex-grow w-full sm:w-fit">
            <Combobox options={profiles} onSelect={handleSearch} />
            {/* <Input
                type="text"
                placeholder="Buscar un usuario..."
                className="w-full pl-9 peer"
                defaultValue={query}
                onChange={(e) => {
                    handleSearch(e.target.value);
                }}
            /> */}
            <Loader2 className={cn('h-4 w-4 animate-spin')} />

            <IconSearch className="h-4 w-4 absolute left-0 top-1/2 -translate-y-1/2 ms-2 text-muted-foreground peer-focus:text-gray-800" />
        </div>
    )
}