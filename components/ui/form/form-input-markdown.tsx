import React, { useCallback, useMemo } from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FieldValues, UseFormReturn, Path } from "react-hook-form";
import SimpleMDEEditor from 'react-simplemde-editor';

type FormInputType<T extends FieldValues> = {
    readonly className?: string;
    readonly form: UseFormReturn<T>;
    readonly name: Path<T>;
    readonly label?: React.ReactNode | string;
    readonly description?: React.ReactNode | string;
}

export default function FormInputMarkdown<T extends FieldValues>({ className, label, description, form, name }: FormInputType<T>) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl>
                        <SimpleMDEEditor
                            value={field.value}

                            onChange={useCallback((value: string) => {
                                field.onChange(value);
                            }, [form])}
                            options={
                                useMemo(() => {
                                    return {
                                        autofocus: false,
                                        spellChecker: false,
                                        toolbar: ["bold", "italic", "heading", "|", "quote", "unordered-list", "ordered-list", "|", "link", "|", "preview"],
                                    };
                                }, [])
                            }
                        />
                    </FormControl>

                    <FormMessage />
                    {description && <FormDescription>{description}</FormDescription>}
                </FormItem>
            )}
        />
    );
}