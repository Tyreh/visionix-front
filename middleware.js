import { NextResponse } from "next/server";

export async function middleware(request) {
    const token = request.cookies.get('accessToken');
    const { pathname } = request.nextUrl;

    // if (pathname === '/') {
    //     return NextResponse.next();
    // }

    if (!token && !pathname.startsWith('/auth')) {
        return NextResponse.redirect(new URL('/auth/login', request.nextUrl));
    } else if (token && pathname.startsWith('/auth')) {
        return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
    } else if (token && pathname === '/') {
        return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
    }
    return NextResponse.next();
} 

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"]
};