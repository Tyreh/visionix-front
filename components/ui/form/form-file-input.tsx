import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from '@/components/ui/file-input';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { DropzoneOptions } from 'react-dropzone';
import { buttonVariants } from '@/components/ui/button';
import { Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from "next/image";
import React from 'react';

interface CustomFormFieldProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    description?: string;
    className?: string
    maxFiles: number;
    multiple: boolean;
    props?: React.InputHTMLAttributes<HTMLInputElement>;
}

const FormFileInput = <T extends FieldValues>({
    control,
    name,
    label,
    description,
    className,
    maxFiles,
    multiple,
    props,
}: CustomFormFieldProps<T>) => {
    const {
        field,
        fieldState: { error },
    } = useController({ control, name });

    const dropzone = {
        multiple: multiple,
        maxFiles: maxFiles,
        maxSize: 4 * 1024 * 1024,
    } satisfies DropzoneOptions;

    return (
        <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
                <FileUploader
                    value={field.value}
                    onValueChange={field.onChange}
                    dropzoneOptions={dropzone}
                    reSelect={true}
                >
                    <FileInput className={cn(
                        buttonVariants({
                            size: "sm",
                            variant: "secondary"
                        }),
                        props,
                    )}>
                        <Paperclip className="size-4" />Cargar archivo
                    </FileInput>
                    {field.value && field.value.length > 0 && (
                        <FileUploaderContent>
                            {field.value.map((file: any, i: number) => (
                                <FileUploaderItem
                                    key={i}
                                    index={i}
                                    aria-roledescription={`file ${i + 1} containing ${file.name
                                        }`}
                                    className="p-0 size-20"
                                >
                                    <AspectRatio className="size-full">
                                        <Image
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            className="object-cover rounded-md"
                                            fill
                                        />
                                    </AspectRatio>
                                </FileUploaderItem>
                            ))}
                        </FileUploaderContent>
                    )}
                </FileUploader>
            </FormControl>

            {description && <FormDescription>{description}</FormDescription>}
            {error && <FormMessage>{error.message}</FormMessage>}
        </FormItem>
    );
};

export default FormFileInput;