import PageContainer from "@/components/layout/page-container";
import { secureFetch } from "@/secure-fetch";
import { redirect } from "next/navigation";

export default async function Page({ params, searchParams }: { params: any; searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const { module } = await params;
    const { id } = await searchParams;

    const response = await secureFetch(`${process.env.API_URL}/${module}${id ? `/${id}` : ''}`);

    if (response.status !== 200) {
        redirect("/dashboard");
    }



    return (
        <PageContainer>
            <div className='flex flex-1 flex-col space-y-2'>
                <div className="flex justify-between items-center">
                    <h3 className='font-semibold'>{`${id ? 'Editar' : 'Crear'} ${response.metadata.entity.singular}`}</h3>
                </div>

                <Form apiUrl={process.env.API_URL || ""} id={id} />
            </div>
        </PageContainer>
    )
}