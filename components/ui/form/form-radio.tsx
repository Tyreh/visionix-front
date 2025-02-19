import React from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface CustomFormFieldProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    description?: string;
    className?: string;
    options: RadioOption[];
    orientation: Orientation;
    
}

export enum Orientation {
    HORIZONTAL = "horizontal",
    VERTICAL = "vertical"
}

export interface RadioOption {
    label: string;
    value: string;
}

const FormRadio = <T extends FieldValues>({
    control,
    name,
    label,
    description,
    className,
    options,
    orientation
}: CustomFormFieldProps<T>) => {
    const {
        field,
        fieldState: { error },
    } = useController({ control, name });

    return (
        <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className={`flex ${orientation === Orientation.VERTICAL ? 'flex-col space-y-1' : 'flex-row space-x-1'}`}
            >
                {options.map((option, index) => (
                    <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                            <RadioGroupItem value={option.value} />
                        </FormControl>
                        <FormLabel className="font-normal">
                            {option.label}
                        </FormLabel>
                    </FormItem>
                ))}

            </RadioGroup>
            {description && <FormDescription>{description}</FormDescription>}
            {error && <FormMessage>{error.message}</FormMessage>}
        </FormItem>
    );
};

export default FormRadio;