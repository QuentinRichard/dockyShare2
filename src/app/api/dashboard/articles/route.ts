import { getSession } from '@/app/lib/session';
import { DockyFileTypeEnum } from '@/db/schema/dockies';
import { getDockies } from '@/repositories/DockiesRepository';
import { NextResponse } from 'next/server';

export async function GET() {
    const session = await getSession();
    const ret = await getDockies(session!.userId, DockyFileTypeEnum.Article);

    return NextResponse.json(ret);
}
