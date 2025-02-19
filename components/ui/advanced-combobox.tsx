"use client"

import { useState, forwardRef } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { secureFetch } from "@/secure-fetch";
import { useDebouncedCallback } from "use-debounce";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import React from "react";
import ViewListTable from "../view/list/view-list-table";

export default function AdvancedCombobox() {

    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value || "Seleccionar..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <ViewListTable apiUrl={process.env.API_URL || ""} config={config} />
            </DialogContent>
        </Dialog>
    );
}
