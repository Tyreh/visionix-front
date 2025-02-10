import { NextResponse } from "next/server";

export async function middleware(request) {
    const refreshToken = request.cookies.get('refreshToken');
    const accessToken = request.cookies.get('accessToken');
    const { pathname } = request.nextUrl;
    const response = NextResponse.next(); // Crear una respuesta

    // if (refreshToken?.value && !accessToken) {
    //     const response = await fetch(`${process.env.API_URL}/auth/refresh-token`, {
    //         method: "POST",
    //         headers: {
    //             "Authorization": `Bearer ${refreshToken}`,
    //             "Content-Type": "application/json"
    //         }
    //     });

    //     const dataResponse = response.data;

    //     response.cookies.set('accessToken', dataResponse.accessToken, {
    //         httpOnly: true,
    //         secure: process.env.NODE_ENV === 'production',
    //     });

    //     response.cookies.set('refreshToken', dataResponse.refreshToken, {
    //         httpOnly: true,
    //         secure: process.env.NODE_ENV === 'production',
    //     });

    //     response.cookies.set('hola', "test", {
    //         httpOnly: true,
    //         secure: process.env.NODE_ENV === 'production',
    //     });
    // }



    // Si no hay refreshToken, redirige a /auth/login y establece una cookie
    if (!refreshToken && !pathname.startsWith('/auth')) {
        return NextResponse.redirect(new URL('/auth/login', request.nextUrl));
    }

    // Si ya tiene refreshToken y está en /auth, redirige a /dashboard
    if (refreshToken && pathname.startsWith('/auth')) {
        return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
    }

    // Si tiene refreshToken y está en la raíz, redirige a /dashboard
    if (refreshToken && pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
    }

    return response; // Retorna la respuesta modificada con la cookie
}

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"]
};
