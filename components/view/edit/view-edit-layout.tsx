import PageContainer from "@/components/layout/page-container";

interface Props {
    children?: React.ReactNode;
    metadata: any;
    title?: string;
    id?: any;
}

export default function ViewEditLayout({ metadata, children, title, id }: Props) {
    return (
        <PageContainer>
            <div className="flex flex-1 flex-col space-y-2">
                <div className="flex flex-col">
                    <h3 className="font-semibold">{id ? 'Editar' : 'Crear'} {metadata.entity.singular}</h3>
                    {id && <p className="text-sm text-muted-foreground">{title}</p>}
                </div>
                {children}
            </div>
        </PageContainer>
    );
}