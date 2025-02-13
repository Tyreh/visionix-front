"use client"

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/ui/form/form-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import FormFieldArray from "@/components/ui/form/form-field-array";
import { secureFetch } from "@/secure-fetch";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export const moduleFormSchema = z.object({
    id: z.string(),
    moduleName: z.string({ required_error: "Este campo es obligatorio" }).min(1, "Este campo es obligatorio").max(25, "El usuario ingresado no es válido"),
    singular: z.string({ required_error: "Este campo es obligatorio" }).min(1, "Este campo es obligatorio").max(25, "El usuario ingresado no es válido"),
    plural: z.string({ required_error: "Este campo es obligatorio" }).min(1, "Este campo es obligatorio").max(30, "La contraseña ingresada no es válida"),
    icon: z.string({ required_error: "Este campo es obligatorio" }).min(1, "Este campo es obligatorio").max(30, "El ícono ingresado no es válido"),
    fields: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            label: z.string()
        })
    )
});

interface Props {
    apiUrl: string;
    id?: string;
}


export default function ConstructForm({ apiUrl, id }: Props) {
    const [loading, setLoading] = useState<boolean>(false);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(moduleFormSchema),
        defaultValues: {
            id: "",
            moduleName: "",
            singular: "",
            plural: "",
            icon: "",
            fields: [{ id: "", name: "", label: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "fields",
    });

    async function onSubmit(values: z.infer<typeof moduleFormSchema>) {
        setLoading(true);
        const response = await secureFetch(`${apiUrl}/module-definition${id ? `/${id}` : ''}`, {
            method: id ? 'PATCH' : 'POST',
            body: JSON.stringify({
                ...(id ? { id: id } : {}),
                moduleName: values.moduleName,
                singular: values.singular,
                plural: values.plural,
                icon: values.icon
            })
        });
        
        if (response.status !== 200) {
            toast({
                variant: "destructive",
                title: '¡Ups!',
                description: response.message,
                duration: 3000
            });
            setLoading(false);
            return;
        }

        for (const field of values.fields) {
            const fieldResponse = await secureFetch(`${apiUrl}/module-definition-field${field.id ? `/${field.id}` : ''}`, {
                method: field.id ? 'PATCH' : 'POST',
                body: JSON.stringify({
                    ...(field.id ? { id: field.id } : {}),
                    moduleDefinition: {id: response.data.id},
                    field: field.name,
                    label: field.label,
                    showInList: false,
                    sortable: false,
                })
            });

            if (fieldResponse.status !== 200) {
                toast({
                    variant: "destructive",
                    title: '¡Ups!',
                    description: fieldResponse.message || 'Error al guardar un campo',
                    duration: 3000
                });
                setLoading(false);
                return; 
            }
        }

        toast({
            title: '🛠️ ¡Construcción completada!',
            description: 'El nuevo módulo ya está en su lugar. ¡Hora de ponerlo en acción!',
            duration: 3000
        });

        router.push(`/dashboard/construct/${response.data.id}`);
        setLoading(false);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                <FormInput name="moduleName" control={form.control} label="Nombre del módulo en la API" />
                <FormInput name="icon" control={form.control} label="Icono" />
                <FormInput name="singular" control={form.control} label="Palabra singular" />
                <FormInput name="plural" control={form.control} label="Palabra plural" />
                <FormFieldArray
                    className="col-span-full"
                    minItems={1}
                    label="Campos"
                    fields={fields}
                    append={() => append({ id: "", name: "", label: "" })}
                    remove={remove}
                    columns={["Nombre del campo", "Etiqueta"]}
                    cells={[
                        ({ index }) => (<FormInput name={`fields.${index}.name`} control={form.control} />),
                        ({ index }) => (<FormInput name={`fields.${index}.label`} control={form.control} />),
                    ]}
                />
                <div className="flex justify-end flex-1 flex-row col-span-full space-x-4">
                    <Button type="submit" variant="secondary" className="w-full md:w-fit">Cancelar</Button>
                    <Button type="submit" className="w-full md:w-fit">Guardar</Button>
                </div>

            </form>
        </Form>
    );
}