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
    showInList?: boolean;
    type?: string;
    redirect?: string;
    nestedValue?: string;
    renderOrder?: number;
}

export default async function ViewRelationLayout({ module, id }: Props) {
    const response = await secureFetch(`${process.env.API_URL}/${module}/${id}`);

    const filteredFields = response ? Object.entries(response.metadata.fields as Record<string, FieldMetadata>)
        .filter(([, fieldMetadata]) => fieldMetadata.showInList && fieldMetadata.type !== "IMAGE")
        .sort(([, a], [, b]) => {
            const orderA = Number(a.renderOrder) || Number.MAX_SAFE_INTEGER;
            const orderB = Number(b.renderOrder) || Number.MAX_SAFE_INTEGER;
            return orderA - orderB; // Orden ascendente
        }) : [];

    const columns = filteredFields.map(([_, fieldMetadata]) => fieldMetadata.label);
    const data = response?.data || [];

    return (
        <div className="col-span-full">
            <Label className="font-semibold">{response.metadata.entity.plural}</Label>
            <div className="rounded-lg border mt-2">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column, index) => <TableHead key={index}>{column}</TableHead>)}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length ? (
                            data.map((item: any, rowIndex: number) => (
                                <TableRow key={rowIndex}>
                                    {filteredFields.map(([key, fieldMetadata]) => {
                                        const fieldValue = getNestedValue(item, fieldMetadata.nestedValue || key) || "-";
                                        const redirectPath = fieldMetadata.redirect ? resolveRedirectPath(fieldMetadata.redirect, item) : null;
                                        return (
                                            <TableCell key={key}>
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
