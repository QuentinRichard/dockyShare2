import { Rules } from '@/db/schema/rules'
import { User } from '@/db/schema/user'
import { JWTPayload, SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import 'server-only'

const secretKey = 'secret_code';//process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export interface Session {
    userId: number
    userEmail: string
    userRule: Rules
    expiresAt: Date
}

export async function encrypt(payload: JWTPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey)
}

export async function decrypt(session: string | undefined = ''): Promise<Session | null> {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        })
        return payload as unknown as Session;
    } catch (error) {
        throw new Error('Failed to verify session');
    }
}
export async function getSession() {
    const session = (await cookies()).get('session')?.value

    if (!session)
        return null;

    return await decrypt(session);
}

export async function createSession(user: User, rule?: Rules) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const session = await encrypt({ userId: user.id, userEmail: user.email, userRule: rule, expiresAt })
    const cookieStore = await cookies()

    cookieStore.set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })
}
export async function updateSession() {
    const session = (await cookies()).get('session')?.value
    const payload = await decrypt(session)

    if (!session || !payload) {
        return null
    }

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    const cookieStore = await cookies()
    cookieStore.set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expires,
        sameSite: 'lax',
        path: '/',
    })
}

export async function deleteSession() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
}

export async function logout() {
    await deleteSession()
    redirect('/login')
}