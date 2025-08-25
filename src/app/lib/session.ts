import { Rules } from '@/db/schema/rules'
import { User } from '@/db/schema/user'
import { JWTPayload, SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
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
        throw new Error(`Failed to verify session ${(error as Error).message}`);
    }
}
export async function getSession() {
    const session = (await cookies()).get('session')?.value

    if (!session)
        return null;

    return await decrypt(session);
}

export async function createSession(user: User, rules?: Rules) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const session = await encrypt({ userId: user.id, email: user.email, rules, expiresAt })
    const cookieStore = await cookies()

    cookieStore.set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })
    cookieStore.set('rules', JSON.stringify(rules))
    cookieStore.set('userId', JSON.stringify(user.id))
}
export async function updateSession() {
    const session = (await cookies()).get('session')?.value;
    const payload = await decrypt(session);
    const rules = (await cookies()).get('rules')?.value;

    if (!session || !payload) {
        return null
    }

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const newSession = await encrypt({ userId: payload.userId, email: payload.userEmail, rules, expiresAt })

    const cookieStore = await cookies()
    cookieStore.set('session', newSession, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })
    cookieStore.set('rules', JSON.stringify(rules))
    cookieStore.set('userId', JSON.stringify(payload.userId))
}

export async function deleteSession() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
    cookieStore.delete('rules');
    cookieStore.delete('userId');
}

