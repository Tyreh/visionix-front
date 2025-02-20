import { Label } from "@/components/ui/label";
import { getNestedValue, resolveRedirectPath } from "@/lib/utils";
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
import DeleteAction from "@/components/view/delete-action";
import PageContainer from "@/components/layout/page-container";

interface FieldMetadata {
    renderOrder?: number;
    label: string;
    colSpan?: string;
    showInDetail?: boolean;
    type?: string;
    nestedValue?: string;
    redirect?: string;
}

interface EntityMetadata {
    singular: string;
    plural: string;
}

interface Metadata {
    fields: FieldMetadata[];
    entity: EntityMetadata;
}

interface Props {
    children?: React.ReactNode;
    id?: string;
    module: string;
    metadata: any;
    extraActions?: React.ReactNode[];
    data: any;
    title?: string;
}

export default function ViewDetailLayout({ module, id, metadata, extraActions, data, title, children }: Props) {

    const imageFields = metadata.fields.filter(field => field.showInDetail && field.type === 'IMAGE');

    return (
        <PageContainer>
            <div className="flex flex-1 flex-col space-y-2">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <h3 className="font-semibold">Detalles de {metadata.entity.singular}</h3>
                        {id && <p className="text-sm text-muted-foreground">{title}</p>}
                    </div>

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
                                        <Link href={`/dashboard/${module}/edit`}>
                                            <DropdownMenuItem>
                                                <CirclePlus />
                                                <span>Crear {metadata.entity.singular}</span>
                                            </DropdownMenuItem>
                                        </Link>

                                        <DialogTrigger className="w-full">
                                            <DropdownMenuItem>
                                                <Trash2 />
                                                Eliminar {metadata.entity.singular}
                                            </DropdownMenuItem>
                                        </DialogTrigger>

                                        {extraActions && extraActions.map((action, index) => (
                                            <React.Fragment key={index}>
                                                {action}
                                            </React.Fragment>
                                        ))}
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DeleteAction apiUrl={process.env.API_URL || ""} moduleName={module} id={id} />
                        </Dialog>
                    </div>
                </div>
                <div className={`flex flex-col ${imageFields.length > 0 ? 'md:flex-row gap-4' : ''}`}>
                    {imageFields.length > 0 && (
                        <div className="w-full md:w-1/5 p-4 border rounded-lg flex flex-col items-center">
                            {imageFields.map(field =>
                                <div key={field.field} className="mb-4">
                                    <Label className="font-semibold">{field.label}</Label>
                                    <img
                                        src={getNestedValue(data, field.nestedValue || field.field)}
                                        alt={field.label}
                                        className="w-full h-auto rounded-lg mt-2"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    <div className={`w-full ${imageFields.length > 0 ? 'md:w-4/5' : ''} grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg`}>
                        {metadata.fields.filter(field => field.showInDetail && field.type !== 'IMAGE').map(field => {
                            const nestedPath = field.nestedValue || field.field;
                            const fieldValue = getNestedValue(data, nestedPath);
                            const redirectPath = field.redirect ? resolveRedirectPath(field.redirect, data) : null;

                            return (
                                <div key={field.field} className={`col-span-1 ${field.colSpan ? `md:col-span-3` : ''}`}>
                                    <Label className="font-semibold">{field.label}</Label>
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
                        {children}

                    </div>

                </div>
            </div>
        </PageContainer>
    );
}