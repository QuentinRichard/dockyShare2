import { DockyFileTypeEnum } from '@/db/schema/dockies';
import { getDockies } from '@/repositories/DockiesRepository';
import { NextResponse } from 'next/server';

export async function GET() {
    //await getSession();
    const ret = await getDockies(10, DockyFileTypeEnum.Article);

    return NextResponse.json(ret);
}
