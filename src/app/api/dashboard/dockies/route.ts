import { DockyPutRequestSchema, DockyRequestSchema } from '@/app/lib/interfaces/dockyRequest';
import { getSession } from '@/app/lib/session';
import { DockyFileDataChildren } from '@/db/schema/dockies';
import { createDocky, deleteDocky, getDockies, getDocky, updateDocky } from '@/repositories/DockiesRepository';
import { NextRequest, NextResponse } from 'next/server';
import { } from 'slug';

export async function GET(request: NextRequest) {
    //await getSession();

    const type = request.nextUrl.searchParams.get("type")
    console.log(type);
    const ret = await getDockies(10, type);

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
        treeId: dataBody.treeId,
        data: dataBody.data,
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return new Response(validatedFields.error.message, {
            status: 400,
        });
    }
    const { name, description, type, cat, isPublic, data, treeId } = validatedFields.data;

    //TODO check User Rules
    const newOne = await createDocky({ name, slug: 'fake', description, type, cat, data, isPublic, userId: session?.userId as number, treeId });


    const result = await getDockies(session?.userId, type);

    return NextResponse.json({ data: result, new: newOne });
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

    const docky = await getDocky(id);
    if (!docky || docky?.userId !== session?.userId) {
        return new Response('Invalid Rules', {
            status: 400,
        })
    }

    await updateDocky({ id, name, description, data, isPublic, treeId, children: children as DockyFileDataChildren[] })

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