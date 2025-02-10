import PageContainer from "@/components/layout/page-container";
import ConstructForm from "./construct-form";

export default async function Page(props: { searchParams: Promise<{ id: string }> }) {
    const searchParams = await props.searchParams;
    const id = searchParams?.id;
    return (
        <PageContainer>
            <div className='flex flex-1 flex-col space-y-2'>
                <div className='pb-10'>
                    <h1 className='text-xl font-semibold'>{`${id ? 'Editar' : 'Crear'} módulo`}</h1>
                </div>

                <ConstructForm apiUrl={process.env.API_URL || ""} id={id} />
            </div>
        </PageContainer>
    )
}