import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { secureFetch } from "@/secure-fetch";
import { Toaster } from '@/components/ui/toaster';
import Providers from '@/components/layout/providers';

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
    const userData = await secureFetch(`${process.env.API_URL}/user/logged-user`);
    return (
        <Providers>
            <SidebarProvider defaultOpen={defaultOpen}>
                <AppSidebar user={userData.data} />
                <SidebarInset>
                    <Header user={userData.data} />
                    {/* page main content */}
                    {children}
                    <Toaster />
                    {/* page main content ends */}
                </SidebarInset>
            </SidebarProvider>
        </Providers>
    );
}