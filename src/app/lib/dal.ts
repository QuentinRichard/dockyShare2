import 'server-only';

import { cache } from 'react';

import { cookies } from 'next/headers';
import { decrypt } from '@/app/lib/session';
import { redirect } from 'next/navigation';
import { findUserByIdentifiant } from '@/repositories/UserRepository';

export const verifySession = cache(async () => {
    const cookie = (await cookies()).get('session')?.value
    const session = await decrypt(cookie)

    if (!session?.userId) {
        redirect('/login')
    }

    return { isAuth: true, userId: session.userId }
})

export const getUser = cache(async () => {
    const session = await verifySession()
    if (!session) return null

    try {
        const data = await findUserByIdentifiant(session.userId.toString())
        return data;
    } catch (error) {
        console.log('Failed to fetch user')
        return null
    }
})
