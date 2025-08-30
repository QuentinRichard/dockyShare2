import { useTreesDefinition } from '@/app/lib/definition';
import { DockyPutRequestSchema, DockyRequestSchema } from '@/app/lib/interfaces/dockyRequest';
import { getSession } from '@/app/lib/session';
import { DockyFileDataChildren, DockyFileTypeEnum } from '@/db/schema/dockies';
import { createDocky, deleteDocky, getDockies, getDocky, getFullDockyBySlugOrId, updateDocky } from '@/repositories/DockiesRepository';
import { getSortedTreesList } from '@/repositories/PropertyRepository';
import { NextRequest, NextResponse } from 'next/server';
import { } from 'slug';
import { addDockyToTrees } from '../trees/utils';

export async function GET(request: NextRequest) {
    //TODO Manage the Public route => provide public docky and article
    // and with session .......
    const session = await getSession();

    const slug = request.nextUrl.searchParams.get("slug")
    if (slug !== undefined && slug?.length === 0) {
        return new NextResponse(
            JSON.stringify({ message: 'invalide parameters' }),
            {
                status: 402,
                headers: { 'content-type': 'application/json' }
            }
        );
    }
    if (slug) {
        const docky = await getFullDockyBySlugOrId(slug);
        return NextResponse.json(docky ?? {});
    }

    const type = request.nextUrl.searchParams.get("type")
    const ret = await getDockies(session?.userId as number, type === "Docky" ? DockyFileTypeEnum.Docky : DockyFileTypeEnum.Article);

    return NextResponse.json(ret);
}

export async function POST(request: Request) {

    const session = await getSession();

    const dataBody = await request.json();
    const validatedFields = DockyRequestSchema.safeParse({
        name: dataBody.name,
        description: dataBody.description,
        type: dataBody.type,
        cat: dataBody.cat,
        isPublic: dataBody.isPublic,
        data: dataBody.data,
        children: [],
        treeId: dataBody.treeId,
        result: dataBody.result,
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return new Response(validatedFields.error.message, {
            status: 400,
        });
    }
    const { name, description, type, cat, isPublic, data, treeId, children, result } = validatedFields.data;

    //TODO check User Rules
    const newOne = await createDocky({ name, slug: 'fake', description, type, cat, data, isPublic, userId: session?.userId as number, treeId });

    if (!result || result === DockyFileTypeEnum.Docky) {
        return NextResponse.json({ data: result, new: newOne });
    } else /* if (result === useTreesDefinition.FullTree) */ {

        const trees = await getSortedTreesList(session?.userId as number, useTreesDefinition.FullTree);
        await addDockyToTrees(session?.userId as number, trees.flat);

        return NextResponse.json({
            data: trees.sorted,
            new: { id: newOne, name, description, type, cat, isPublic, data, treeId, children, userId: session?.userId as number }
        });
    }
}

export async function PUT(request: Request) {

    const session = await getSession();

    const dataBody = await request.json();
    const validatedFields = DockyPutRequestSchema.safeParse({
        id: dataBody.id,
        name: dataBody.name,
        description: dataBody.description,
        data: dataBody.data,
        isPublic: dataBody.isPublic,
        treeId: dataBody.treeId,
        children: dataBody.children,
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return new Response(validatedFields.error.message, {
            status: 400,
        })
    }
    const { id, name, description, data, isPublic, treeId, children } = validatedFields.data;

    // Check if the owner of parent is the user

    const docky = await getFullDockyBySlugOrId(undefined, id);
    if (!docky || docky?.userId !== session?.userId) {
        return new Response('Invalid Rules', {
            status: 400,
        })
    }

    await updateDocky({ ...docky, name, description, data, isPublic, treeId, children: children as DockyFileDataChildren[] })

    return NextResponse.json({ status: "succes" });
}


export async function DELETE(request: NextRequest) {

    const session = await getSession();


    const id = Number(request.nextUrl.searchParams.get("id"));
    // If any form fields are invalid, return early
    if (!id || !Number.isInteger(id)) {
        return new Response('Invalid parameters', {
            status: 400,
        });
    }

    // Check if the owner of parent is the user
    const currentTree = await getDocky(id);
    if (!currentTree || currentTree?.userId !== session?.userId) {
        return new Response('Invalid Rules', {
            status: 400,
        })
    }

    await deleteDocky(id);

    return NextResponse.json({ status: "succes" });
}