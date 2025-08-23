import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/app/lib/session'
import { cookies } from 'next/headers'

// 1. Specify protected and public routes
const protectedRoutes = ['/dashboard']
const publicRoutes = ['/login', '/signup', '/']
const uncheckedRoutes = ['/favicon.ico']



export default async function middleware(req: NextRequest) {
    // 2. Check if the current route is protected or public
    const path = req.nextUrl.pathname

    const isUncheckedRoute = uncheckedRoutes.includes(path)
    if (isUncheckedRoute)
        return NextResponse.next();

    const isPublicRoute = publicRoutes.includes(path)
    if (isPublicRoute)
        return NextResponse.next();

    // const start = Date.now();
    const isProtectedRoute = protectedRoutes.includes(path)

    // 3. Decrypt the session from the cookie
    const cookie = (await cookies()).get('session')?.value
    const session = await decrypt(cookie)

    // 4. Redirect to /login if the user is not authenticated
    if (isProtectedRoute && !session?.userId) {
        // const responseTime = Date.now() - start;
        // logger.info({
        //     method: req.method,
        //     path: req.url,
        //     status: "redirectLogin",
        //     responseTime: `${responseTime}ms`,
        //     ip: req.headers.get('X-Forwarded-For') || req.headers.get('x-real-ip') || 'unknown',
        // });
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }


    // const responseTime = Date.now() - start;
    // logger.info({
    //     method: req.method,
    //     path: req.url,
    //     status: status,
    //     responseTime: `${responseTime}ms`,
    //     ip: req.headers.get('X-Forwarded-For') || req.headers.get('x-real-ip') || 'unknown',
    // });
    return NextResponse.next();;
}

// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}