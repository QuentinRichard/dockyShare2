import { TreePutRequestSchema, TreeRequestSchema } from '@/app/lib/interfaces/treesRequest';
import { getSession } from '@/app/lib/session';
import { DockyFileTypeEnum } from '@/db/schema/dockies';
import { IPropertiesTable } from '@/db/schema/property';
import { addTree, getSortedTreesList, getTree, updateTree } from '@/repositories/PropertyRepository';
import { NextRequest, NextResponse } from 'next/server';
import { addDockyToTrees } from './utils';

export async function GET(request: NextRequest) {
    const session = await getSession();

    const type = request.nextUrl.searchParams.get("type")
    console.log(type);
    /**
     * Tree type :
     * 1 : Tree : TreeWithout doky
     * 2 : FullTree: Tree With all doky Items
     * 3 : Doky : Tree with doky only 
     * 4 : Article : Tree with article only
     * 5 : ..... Like Event
     */

    // Process the response with type
    const trees = await getSortedTreesList(session?.userId!);
    if (type == 'FullTree') {
        await addDockyToTrees(session?.userId!, trees.flat);
    }
    else if (type == 'Docky') {
        await addDockyToTrees(session?.userId!, trees.flat, DockyFileTypeEnum.Docky);
    }
    else if (type == 'Article') {
        await addDockyToTrees(session?.userId!, trees.flat, DockyFileTypeEnum.Article);
    }
    //Type=Tree by default
    return NextResponse.json(trees.sorted);
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

    //TODO Check if the owner of parent is the user
    // if (!parentTree || parentTree?.userId !== session?.userId) {
    //     return new Response("Invalide rules", {
    //         status: 400,
    //     });
    // }

    const prop: IPropertiesTable = {
        name,
        content,
        type,
        parentId,
        userId: session?.userId,
    }
    const id = await addTree(prop);

    return NextResponse.json({ data: (await getSortedTreesList(session?.userId)).sorted, new: id });
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