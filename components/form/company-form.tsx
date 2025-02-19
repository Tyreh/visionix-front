"use client"

import FormInput from "@/components/ui/form/form-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { secureFetch } from "@/secure-fetch";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { z } from "zod";

interface Props {
    apiUrl: string;
    module: string;
    data: any;
}

export function CompanyForm({ apiUrl, module, data }: Props) {
    const CompanySchema = z.object({
        id: z.string().optional(),
        name: z.string()
            .max(60, "El nombre de la compañía no puede exceder los 60 caracteres.")
            .min(1, "El nombre de la compañía es obligatorio y no puede estar vacío."),
        nit: z.string()
            .max(60, "El NIT de la compañía no puede exceder los 20 caracteres.")
            .min(1, "El NIT de la compañía es obligatorio y no puede estar vacío."),
    });

    const form = useForm({
        resolver: zodResolver(CompanySchema),
        defaultValues: {
            id: "",
            name: "",
            nit: "",
        },
        mode: "onBlur",
        reValidateMode: "onBlur"
    });

    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    async function onSubmit(values: z.infer<typeof CompanySchema>) {
        setLoading(true);
        const response = await secureFetch(`${apiUrl}/${module}${data ? `/${data.id}` : ''}`, {
            method: data ? 'PATCH' : 'POST',
            body: JSON.stringify(values)
        });
        console.log(response);
    
        if (response.status !== 200) {
            // Manejar errores por campo
            if (response.errors) {
                response.errors.forEach((err: { field: string; message: string }) => {
                    form.setError(err.field as keyof z.infer<typeof CompanySchema>, {
                        type: "server",
                        message: err.message
                    });
                });
            }
    
            // Mostrar errores en un toast con viñetas
            const errorMessages = response.errors?.map((err: { message: string }) => `• ${err.message}`).join("<br>") || response.message;
            toast({
                variant: "destructive",
                title: '¡Ups!',
                description: (
                    <div dangerouslySetInnerHTML={{ __html: errorMessages }} />
                ),
                duration: 3000
            });
    
            setLoading(false);
            return;
        }
    
        toast({
            title: '🎉 ¡Todo listo!',
            description: 'Se ha creado una nueva compañía con éxito.',
            duration: 3000
        });
    
        router.push(`/dashboard/${module}/${response.data.id}`);
        router.refresh();
    }

    useEffect(() => {
        if (data) {
            form.setValue('id', data.id);
            form.setValue('name', data.name);
            form.setValue('nit', data.nit);
        }
    }, [apiUrl, module, data])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput name="name" control={form.control} label="Nombre de la compañía" />
                <FormInput name="nit" control={form.control} label="NIT" />
                <div className="flex justify-end flex-1 flex-row col-span-full space-x-4">
                    {!loading && <Button type="button" variant="secondary" className="w-full md:w-fit" onClick={() => router.back()}>Cancelar</Button>}
                    <Button loading={loading} type="submit" className="w-full md:w-fit">Guardar</Button>
                </div>
            </form>
        </Form>
    );
}