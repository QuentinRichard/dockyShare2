import { decrypt } from '@/app/lib/session';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// 1. Specify protected and public routes
const publicRoutes = ['/favicon.ico', '/', '/login', '/signup', '/signin'];


export default async function middleware(req: NextRequest) {
    // 2. Check if the current route is protected or public
    const path = req.nextUrl.pathname

    const isPublicRoute = publicRoutes.includes(path)
    if (isPublicRoute)
        return NextResponse.next();


    // 3. Decrypt the session from the cookie
    try {
        const cookie = (await cookies()).get('session')?.value
        const session = await decrypt(cookie)
        // 4. Redirect to /login if the user is not authenticated
        if (!session?.userId) {
            // const responseTime = Date.now() - start;
            // logger.info({
            //     method: req.method,
            //     path: req.url,
            //     status: "redirectLogin",
            //     responseTime: `${responseTime}ms`,
            //     ip: req.headers.get('X-Forwarded-For') || req.headers.get('x-real-ip') || 'unknown',
            // });
            return NextResponse.redirect(new URL('/login', req.nextUrl));
        }
    }
    catch (e) {
        console.log(`middleware exception ${(e as Error).message}`)
        return NextResponse.redirect(new URL('/login', req.nextUrl));
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