import PageContainer from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ViewListTable, { ViewConfigDefinition } from "@/components/view/list/view-list-table";
import { cn } from "@/lib/utils";
import { secureFetch } from "@/secure-fetch";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { module: string } }) {
    const { module } = params;
    const response = await secureFetch(`${process.env.API_URL}/${module}/search`);

    if (response.status !== 200) {
        redirect("/dashboard");
    }

    const columns = response.metadata;
    const data = response.data;

    const config: ViewConfigDefinition = {
        entity: response.metadata.entity,
        module: module,
        fields: response.metadata.fields
    }


    return (
        <PageContainer scrollable={false}>
            <div className="flex flex-1 flex-col space-y-4">
                <ViewListTable apiUrl={process.env.API_URL || ""} config={config} />
                {/* <ViewTable rawColumns={columns} rawData={data} module={module} apiUrl={process.env.API_URL || ""} /> */}
            </div>
        </PageContainer>
    );
}
