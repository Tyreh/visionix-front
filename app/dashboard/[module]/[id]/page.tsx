import ViewRelationLayout from "@/components/view/detail/view-relation-layout";
import ViewDetailLayout from "@/components/view/detail/view-detail-layout";
import { secureFetch } from "@/secure-fetch";
import { redirect } from "next/navigation";
import React from "react";

export default async function Page({ params }: { params: { module: string; id: string } }) {
    const { module, id } = params;
    const response = await secureFetch(`${process.env.API_URL}/${module}/${id}`, { cache: "no-store" });

    if (response.status !== 200) {
        redirect("/dashboard");
    }

    return (
        <ViewDetailLayout module={module} id={id} metadata={response.metadata} data={response.data} title={response?.data?.title}>
            {response.metadata.entity.relations && response.metadata.entity.relations.map((relation: string, index: React.Key | null | undefined) =>
                <ViewRelationLayout key={index} module={relation} id={id} />
            )}
        </ViewDetailLayout>
    );
}
