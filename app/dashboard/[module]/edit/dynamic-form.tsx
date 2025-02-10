"use client"

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { secureFetch } from "@/secure-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Props {
    apiurl: string;
    module: string;
    id?: string;
    schema: z.ZodObject<any>;
}

export default function DynamicForm({ apiUrl, id, schema, module }: Props) {
    const [loading, setLoading] = useState<boolean>(false);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: Object.fromEntries(
            Object.entries(schema.shape).map(([key, value]) => {
                if (value instanceof z.ZodString) return [key, ""];
                if (value instanceof z.ZodNumber) return [key, 0];
                if (value instanceof z.ZodBoolean) return [key, false];
                if (value instanceof z.ZodDate) return [key, new Date()];
                return [key, null];
            })
        ),
    });

    async function onSubmit(values: any) {
        const response = await secureFetch(`${apiUrl}/${module}${id ? `/${id}` : ""}`, {
            method: id ? "PATCH" : "POST",
            body: JSON.stringify(values),
        })
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                <div className="flex justify-end flex-1 flex-row col-span-full space-x-4">
                    <Button type="submit" variant="secondary" className="w-full md:w-fit">Cancelar</Button>
                    <Button type="submit" className="w-full md:w-fit">Guardar</Button>
                </div>
            </form>
        </Form>
    );
}