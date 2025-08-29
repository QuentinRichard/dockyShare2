import { getSession } from '@/app/lib/session';
import { DockyFileTypeEnum } from '@/db/schema/dockies';
import { getDockies } from '@/repositories/DockiesRepository';
import { getSortedTreesList } from '@/repositories/PropertyRepository';
import { NextResponse } from 'next/server';

export async function GET() {

    const session = await getSession();

    return NextResponse.json({
        trees: (await getSortedTreesList(session!.userId!)).sorted,
        dockies: await getDockies(session!.userId, DockyFileTypeEnum.Docky),
        articles: await getDockies(session!.userId, DockyFileTypeEnum.Article)
    });
}