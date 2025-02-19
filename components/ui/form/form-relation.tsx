import React from "react";
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control, useController, FieldValues, Path } from "react-hook-form";
import ViewRelationListTable from "@/components/view/relation/view-relation-list-table";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";

type FormRelationType<T extends FieldValues> = {
    control: Control<T>;
    name: Path<T>;
    module: string;
    label?: string;
    description?: string;
    className?: string;
    apiUrl: string;
};

export default function FormRelation<T extends FieldValues>({
    control, className, label, description, name, module, apiUrl
}: FormRelationType<T>) {
    const { field, fieldState: { error } } = useController({ control, name });

    const handleSelect = (selectedItem: any) => {
        console.log(selectedItem);
        field.onChange(selectedItem);
    };

    return (
        <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
                <ViewRelationListTable
                    apiUrl={apiUrl}
                    module={module}
                    onSelect={handleSelect}
                    trigger={
                        <Button
                            variant="outline"
                            className="w-full justify-between"
                        >
                            {field.value.label || 'Seleccionar...'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    }
                />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            {error && <FormMessage>{error.message}</FormMessage>}
        </FormItem>
    );
}
