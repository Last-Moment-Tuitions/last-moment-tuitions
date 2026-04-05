import { NextResponse } from 'next/server';

export function middleware(request) {
    // Check for the sessionId cookie which indicates an active or recently active session
    const sessionId = request.cookies.get('sessionId')?.value;
    const { pathname } = request.nextUrl;

    // Routes that authenticated users should NOT be able to access
    const authRoutes = ['/signin', '/signup', '/forgot-password'];

    // If a user has a sessionId cookie and tries to access auth routes, redirect to home
    if (sessionId && authRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // You can also add protection for admin routes here if needed
    // const adminRoutes = ['/admin'];
    // if (!sessionId && adminRoutes.some(route => pathname.startsWith(route))) {
    //     return NextResponse.redirect(new URL('/signin', request.url));
    // }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|assets).*)',
    ],
};
