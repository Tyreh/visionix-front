import { Label } from "@/components/ui/label";
import { getNestedValue, resolveRedirectPath } from "@/lib/utils";
import { secureFetch } from "@/secure-fetch";
import { redirect } from "next/navigation";
import { ChevronDown, CirclePlus, Trash2 } from "lucide-react";
import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import DeleteAction from "./delete-action";
import PageContainer from "@/components/layout/page-container";

export default async function Page({ params }: { params: { module: string; id: string } }) {
    const { module, id } = await params;
    const response = await secureFetch(`${process.env.API_URL}/${module}/${id}`);

    if (response.status !== 200) {
        redirect("/dashboard");
    }

    const imageFields = Object.entries(response.metadata.fields).filter(
        ([, fieldMetadata]) => fieldMetadata.type === "IMAGE"
    );

    return (
        <PageContainer>
            <div className='flex flex-1 flex-col space-y-2'>
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Detalles de {response.metadata.entity.singular}</h3>

                    <div className="flex flex-nowrap">
                        <Link
                            href={`/dashboard/${module}/edit?id=${id}`}
                            className={`${buttonVariants({ variant: "default" })} rounded-e-none`}
                        >
                            Editar
                        </Link>
                        <Dialog>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="icon" className="rounded-s-none">
                                        <ChevronDown />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuGroup>
                                        <Link href={`/app/${module}/edit`}>
                                            <DropdownMenuItem>
                                                <CirclePlus />
                                                <span>Crear {response.metadata.entity.singular}</span>
                                            </DropdownMenuItem>
                                        </Link>

                                        <DialogTrigger className="w-full">
                                            <DropdownMenuItem>
                                                <Trash2 />
                                                Eliminar {response.metadata.entity.singular}
                                            </DropdownMenuItem>
                                        </DialogTrigger>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DeleteAction apiUrl={process.env.API_URL || ""} moduleName={module} id={id} />
                        </Dialog>
                    </div>
                </div>

                {/* Si hay imágenes, usar flex-row para que estén a la izquierda */}
                <div className={`flex flex-col ${imageFields.length > 0 ? 'md:flex-row gap-4' : ''}`}>

                    {imageFields.length > 0 && (
                        <div className="w-full md:w-1/5 p-4 border rounded-lg flex flex-col items-center">
                            {imageFields.map(([key, fieldMetadata]) => (
                                <div key={key} className="mb-4">
                                    <Label className="font-semibold">{fieldMetadata.label}</Label>
                                    <img
                                        src={getNestedValue(response.data, fieldMetadata.nestedValue || key)}
                                        alt={fieldMetadata.label}
                                        className="w-full h-auto rounded-lg mt-2"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className={`w-full ${imageFields.length > 0 ? 'md:w-4/5' : ''} grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg`}>
                        {Object.entries(response.metadata.fields).map(([key, fieldMetadata]) => {
                            if (!fieldMetadata.showInDetail || fieldMetadata.type === "IMAGE") return null;

                            const nestedPath = fieldMetadata.nestedValue || key;
                            const fieldValue = getNestedValue(response.data, nestedPath);
                            const redirectPath = fieldMetadata.redirect ? resolveRedirectPath(fieldMetadata.redirect, response.data) : null;

                            return (
                                <div key={key} className="col-span-1">
                                    <Label className="font-semibold">{fieldMetadata.label}</Label>
                                    <div className="rounded-lg px-3 py-2 bg-muted mt-2 break-words whitespace-normal h-10">
                                        {redirectPath ? (
                                            <Link className="text-primary hover:text-opacity-90 hover:underline" href={`/dashboard/${redirectPath}`}>{fieldValue}</Link>
                                        ) : (
                                            fieldValue
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </PageContainer >
    );
}

