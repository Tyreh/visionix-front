import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getNestedValue, resolveRedirectPath } from "@/lib/utils";
import { secureFetch } from "@/secure-fetch";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React from "react";

export interface Props {
    module: string;
    id: string;
}

export interface FieldMetadata {
    label: string;
    field: string;
    showInList?: boolean;
    type?: string;
    redirect?: string;
    nestedValue?: string;
    renderOrder?: number;
}

export default async function ViewRelationLayout({ module, id }: Props) {
    const response = await secureFetch(`${process.env.API_URL}/${module}/${id}`);
    const columns: FieldMetadata[] = response.metadata.fields.filter((field: FieldMetadata) => field.showInList);
    const data = response?.data || [];

    return (
        <div className="col-span-full">
            <Label className="font-semibold">{response.metadata.entity.plural}</Label>
            <div className="rounded-lg border mt-2">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((field, index) => <TableHead key={index}>{field.label}</TableHead>)}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length ? (
                            data.map((item: any, rowIndex: number) => (
                                <TableRow key={rowIndex}>
                                    {columns.map(field => {
                                        const nestedPath = field.nestedValue || field.field;
                                        const fieldValue = getNestedValue(item, nestedPath);
                                        const redirectPath = field.redirect ? resolveRedirectPath(field.redirect, item) : null;
                                        return (
                                            <TableCell key={`${item.id}-${field.field}`}>
                                                {redirectPath ? (
                                                    <Link className="text-primary hover:text-opacity-90 hover:underline" href={`/dashboard/${redirectPath}`}>
                                                        {fieldValue}
                                                    </Link>
                                                ) : (
                                                    fieldValue
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No se encontró ningún resultado
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
