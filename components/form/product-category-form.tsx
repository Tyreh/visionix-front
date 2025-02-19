"use client"

import FormRelation from "@/components/ui/form/form-relation";
import FormInput from "@/components/ui/form/form-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { secureFetch } from "@/secure-fetch";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { z } from "zod";
import FormFileInput from "@/components/ui/form/form-file-input";

interface Props {
    apiUrl: string;
    module: string;
    data: any;
}

export function ProductCategoryForm({ apiUrl, module, data }: Props) {
    const ProductCategorySchema = z.object({
        id: z.string().optional(),
        name: z.string()
            .max(80, "El nombre de la categoría no puede exceder los 80 caracteres.")
            .min(1, "El nombre de la categoría es obligatorio y no puede estar vacío."),
        parentCategory: z.object({
            value: z.string(),
            label: z.string(),
        }).optional(),
        image: z.array(
            z.instanceof(File).refine((file) => file.size < 4 * 1024 * 1024, {
                message: "El archivo no puede pesar más de 4MB",
            }),
        )
            .max(1, {
                message: "Solo puedes seleccionar 1 archivo.",
            })
            .nullable(),
    });

    const form = useForm({
        resolver: zodResolver(ProductCategorySchema),
        defaultValues: {
            id: "",
            name: "",
            parentCategory: "",
            image: null
        },
        mode: "onBlur",
        reValidateMode: "onBlur"
    });

    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    async function onSubmit(values: z.infer<typeof ProductCategorySchema>) {
        setLoading(true);
        const response = await secureFetch(`${apiUrl}/${module}${data ? `/${data.id}` : ''}`, {
            method: data ? 'PATCH' : 'POST',
            body: JSON.stringify({
                ...(data ? { id: data.id } : {}),
                name: values.name,
                ...(values.parentCategory ? { parentCategory: { id: values.parentCategory.value } } : {}),
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

        toast({
            title: '🎉 ¡Todo listo!',
            description: 'Se ha creado una nueva categoría con éxito. Comienza a organizar tus productos de manera eficiente.',
            duration: 3000
        });

        router.push(`/dashboard/${module}/${response.data.id}`);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput name="name" control={form.control} label="Nombre de la categoría" />
                <FormRelation apiUrl={apiUrl} name="parentCategory" control={form.control} label="Categoría asociada" module="productCategory" />
                <FormFileInput label="Imagen" control={form.control} name="image" maxFiles={1} multiple={false} />
                <div className="flex justify-end flex-1 flex-row col-span-full space-x-4">
                    {!loading && <Button variant="secondary" className="w-full md:w-fit" onClick={() => router.back()}>Cancelar</Button>}
                    <Button loading={loading} type="submit" className="w-full md:w-fit">Guardar</Button>
                </div>
            </form>
        </Form>
    );
}