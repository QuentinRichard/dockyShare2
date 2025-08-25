import { TreePutRequestSchema, TreeRequestSchema } from '@/app/lib/interfaces/treesRequest';
import { getSession } from '@/app/lib/session';
import { IPropertiesTable } from '@/db/schema/property';
import { addTree, getSortedTreesList, getTree, updateTree } from '@/repositories/PropertyRepository';
import { NextResponse } from 'next/server';

export async function GET() {
    await getSession();

    const ret = await getSortedTreesList(10);

    return NextResponse.json(ret);
}

export async function POST(request: Request) {

    const session = await getSession();

    const data = await request.json();
    const validatedFields = TreeRequestSchema.safeParse({
        name: data.name,
        content: data.content,
        type: data.type,
        parentId: data.parentId
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return new Response(validatedFields.error.message, {
            status: 400,
        });
    }
    const { name, content, type, parentId } = validatedFields.data;

    // Check if the owner of parent is the user
    const parentTree = await getTree(parentId);
    if (!parentTree || parentTree?.userId !== session?.userId) {
        return new Response("Invalide rules", {
            status: 400,
        });
    }

    const prop: IPropertiesTable = {
        name,
        content,
        type,
        parentId,
        userId: session?.userId,
    }
    const id = await addTree(prop);

    return NextResponse.json(id);
}

export async function PUT(request: Request) {

    const session = await getSession();

    const data = await request.json();
    const validatedFields = TreePutRequestSchema.safeParse({
        id: data.id,
        name: data.name,
        content: data.content,
        parentId: data.parentId
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return new Response(validatedFields.error.message, {
            status: 400,
        });
    }
    const { id, name, content, parentId } = validatedFields.data;

    // Check if the owner of parent is the user
    const currentTree = await getTree(id);
    if (!currentTree || currentTree?.userId !== session?.userId) {
        return new Response("Invalide rules", {
            status: 400,
        });
    }
    currentTree.name = name;
    currentTree.content = content;
    currentTree.parentId = parentId;

    await updateTree(currentTree);

    return NextResponse.json({ status: "succes" });
}


export async function DELETE(request: Request) {

    const session = await getSession();

    const data = await request.json();
    const validatedFields = TreePutRequestSchema.safeParse({
        id: data.id
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return new Response(validatedFields.error.message, {
            status: 400,
        });
    }
    const { id } = validatedFields.data;

    // Check if the owner of parent is the user
    const currentTree = await getTree(id);
    if (!currentTree || currentTree?.userId !== session?.userId) {
        return new Response("Invalide rules", {
            status: 400,
        });
    }


    return NextResponse.json({ status: "succes" });
}