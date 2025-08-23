import { NextResponse } from 'next/server';
import { User } from '@/db/schema/user';
import { Rules } from '@/db/schema/rules';
import { createUser } from '@/repositories/UserRepository';
import { createSession } from '@/app/lib/session';
import { redirect } from 'next/navigation';

export async function POST() {
    return NextResponse.json({ success: true });
}

export async function GET() {

    const user = new User('q@q.com', 'qq', 'q', 0);

    const userid = await createUser(user);
    await createSession(userid.users, userid.rules as Rules);
    // 5. Redirect user
    redirect('/dashboard')
}