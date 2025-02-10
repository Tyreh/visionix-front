import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { nanoid } from "nanoid";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ReactNode, useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import { FormMessage } from "../form";

export interface FieldArrayComponentCellRendererProps<TField> {
    index: number;
    field: TField;
}

interface FieldArrayComponentProps<TField> {
    readonly label: string;
    readonly columns?: string[];
    readonly fields: TField[];
    readonly append: (value: Partial<TField>) => void;
    readonly remove: (index: number) => void;
    readonly cells: ((props: FieldArrayComponentCellRendererProps<TField>) => ReactNode)[];
    readonly className?: string;
    readonly error?: any;
    readonly minItems?: number;
}

function FormFieldArray<TField>({
    label,
    columns = [],
    fields,
    append,
    remove,
    cells,
    className,
    error,
    minItems = -1
}: FieldArrayComponentProps<TField>) {
    const [fieldKeys, setFieldKeys] = useState<string[]>([]);

    useEffect(() => {
        setFieldKeys(fields.map(() => nanoid()));
    }, [fields]);

    const handleAppend = () => {
        if (append) {
            append({} as Partial<TField>);
            setFieldKeys(prevKeys => [...prevKeys, nanoid()]);
        }
    };

    const handleRemove = (index: number) => {
        if (remove) {
            remove(index);
            setFieldKeys(prevKeys => prevKeys.filter((_, i) => i !== index));
        }
    };

    return (
        <div className={className}>
            <Card>
                <CardHeader>
                    <Label>{label}</Label>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableCaption>
                            {fields.length === 0 && <p className="py-6">Aún no has agregado ningún elemento</p>}
                            {error && <FormMessage>{error.message}</FormMessage>}
                            <Button type="button" variant="secondary" className="w-full hover:bg-green-100" size="icon" onClick={handleAppend}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </TableCaption>

                        {columns.length > 0 &&
                            <TableHeader>
                                <TableRow className="hover:bg-inherit">
                                    {columns.map(column =>
                                        <TableHead key={nanoid()} className="ps-0">
                                            {column}
                                        </TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                        }
                        <TableBody>
                            {
                                fields.map((field, index) =>
                                    <TableRow key={fieldKeys[index]} className="hover:bg-inherit">
                                        {
                                            cells.map((cellRenderer, cellIndex) =>
                                                <TableCell key={cellIndex} className="ps-0">
                                                    {
                                                        cellRenderer({ index, field })
                                                    }
                                                </TableCell>
                                            )
                                        }
                                        {(index + 1) > minItems &&
                                            <TableCell className="w-[10px] p-0 m-0">
                                                <Button type="button" className="hover:bg-red-100" size="icon" variant="secondary" onClick={() => handleRemove(index)}>
                                                    <Minus size={18} />
                                                </Button>
                                            </TableCell>
                                        }
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>

                </CardContent>
            </Card>
        </div>
    );
}

export default FormFieldArray;