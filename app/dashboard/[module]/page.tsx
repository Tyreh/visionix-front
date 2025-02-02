import PageContainer from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ViewList from "@/components/view/list/view-list";
import { cn } from "@/lib/utils";
import { secureFetch } from "@/secure-fetch";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";


export default async function Page({ params }: { params: { module: string } }) {
    const { module } = await params;
    console.log(`${process.env.API_URL}/module-definition`)
    const configDefinitions = await secureFetch(`${process.env.API_URL}/module-definition`);
    const config = configDefinitions.data.find((def: { moduleName: string; }) => def.moduleName === module);
    if (!config) return redirect("/");
    return (
        <PageContainer scrollable={false}>
            <div className="flex flex-1 flex-col space-y-4">
                <div className="flex items-center justify-between">
                    <h2>{config.plural}</h2>
                    <Link href='/dashboard/product/new' className={cn(buttonVariants(), 'text-xs md:text-sm')}>
                        <Plus className='mr-2 h-4 w-4' /> Nuevo
                    </Link>
                </div>
                <Separator/>
                <ViewList apiUrl={process.env.API_URL} config={config} />
            </div>
        </PageContainer>
    );
}