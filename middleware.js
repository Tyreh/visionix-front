import { NextResponse } from "next/server";

export async function middleware(request) {
    const refreshToken = request.cookies.get('refreshToken');
    const { pathname } = request.nextUrl;

    // if (pathname === '/') {
    //     return NextResponse.next();
    // }

    if (!refreshToken && !pathname.startsWith('/auth')) {
        return NextResponse.redirect(new URL('/auth/login', request.nextUrl));
    } else if (refreshToken && pathname.startsWith('/auth')) {
        return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
    } else if (refreshToken && pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
    }
    return NextResponse.next();
} 

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"]
};