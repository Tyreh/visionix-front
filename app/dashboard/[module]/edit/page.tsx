import ViewEditLayout from "@/components/view/edit/view-edit-layout";
import { secureFetch } from "@/secure-fetch";
import { redirect } from "next/navigation";
import { ProductCategoryForm } from "@/components/form/product-category-form";
import { CurrencyForm } from "@/components/form/currency-form"; 
import { CompanyForm } from "@/components/form/company-form"; 
import { PriceListForm } from "@/components/form/price-list-form";

export default async function Page({ params, searchParams }: { params: any; searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const { module } = params;
    const { id } = await searchParams;

    const response = await secureFetch(`${process.env.API_URL}/${module}${id ? `/${id}` : ''}`);

    if (response.status !== 200) {
        redirect("/dashboard");
    }

    const formComponents: { [key: string]: React.FC<{ apiUrl: string; module: string; id?: string }> } = {
        productCategory: ProductCategoryForm,
        currency: CurrencyForm,
        company: CompanyForm,
        priceList: PriceListForm,
    };

    const FormComponent = formComponents[module];
    
    return (
        <ViewEditLayout metadata={response.metadata} id={id} title={response?.data?.title}>
            {FormComponent ? <FormComponent apiUrl={process.env.API_URL!} module={module} data={id ? response.data : null} /> : <p>Formulario no disponible</p>}
        </ViewEditLayout>
    );
}
