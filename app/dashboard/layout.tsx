import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { secureFetch } from "@/secure-fetch";

export const metadata: Metadata = {
    title: 'Next Shadcn Dashboard Starter',
    description: 'Basic dashboard with Next.js and Shadcn'
};

export default async function DashboardLayout({
    children
}: {
    children: React.ReactNode;
}) {
    // Persisting the sidebar state in the cookie.
    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';
    const userData = await secureFetch(`http://localhost:8080/api/v1/user/logged-user`);
    console.log(userData)
    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar user={userData} />
            <SidebarInset>
                <Header user={userData} />
                {/* page main content */}
                {children}
                {/* page main content ends */}
            </SidebarInset>
        </SidebarProvider>
    );
}