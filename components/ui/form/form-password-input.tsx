import React from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PasswordInput } from '@/components/ui/password-input';

interface CustomFormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  description?: string;
  className?: string;
  props?: React.InputHTMLAttributes<HTMLInputElement>;
}

const FormPasswordInput = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  className,
  props,
}: CustomFormFieldProps<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  return (
    <FormItem className={className}>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <PasswordInput
          {...field}
          {...props}
        />
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      {error && <FormMessage>{error.message}</FormMessage>}
    </FormItem>
  );
};

export default FormPasswordInput;