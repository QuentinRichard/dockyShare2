import { useTreesDefinition } from '@/app/lib/definition';
import { TreePutRequestSchema, TreeRequestSchema } from '@/app/lib/interfaces/treesRequest';
import { getSession } from '@/app/lib/session';
import { DockyFileTypeEnum } from '@/db/schema/dockies';
import { IPropertiesTable } from '@/db/schema/property';
import { addTree, getSortedTreesList, getTree, updateTree } from '@/repositories/PropertyRepository';
import { NextRequest, NextResponse } from 'next/server';
import { addDockyToTrees } from './utils';

function convertTreeType(type: useTreesDefinition | null): DockyFileTypeEnum | null {
    switch (type) {
        case useTreesDefinition.TreeDocky:
        case useTreesDefinition.FullTreeDocky:
            return DockyFileTypeEnum.Docky;
            break;
        case useTreesDefinition.TreeArticle:
        case useTreesDefinition.FullTreeArticle:
            return DockyFileTypeEnum.Article;
            break;
        default:
            return null;
    }
}

export async function GET(request: NextRequest) {
    const session = await getSession();

    const type = request.nextUrl.searchParams.get("type");

    // Process the response with type
    //TODO use Rules to retrieve Admin Trees
    const TypeDef = type as unknown as useTreesDefinition;
    const trees = await getSortedTreesList(session?.userId as number, TypeDef);
    console.log('trees.sorted1:', trees.sorted[0].children![0]?.children?.length)
    switch (TypeDef) {
        //Tree, TreeDocky, TreeArticle, FullTree, FullTreeDocky, FullTreeArticle
        case useTreesDefinition.Tree:
        case useTreesDefinition.TreeDocky:
        case useTreesDefinition.TreeArticle:
            break;
        case useTreesDefinition.FullTree:
            await addDockyToTrees(session?.userId as number, trees.flat);
            break;
        case useTreesDefinition.FullTreeDocky:
        case useTreesDefinition.FullTreeArticle:
        default:
            await addDockyToTrees(session?.userId as number, trees.flat, convertTreeType(TypeDef));
            break;
    }

    //Type=Tree by default
    console.log('trees.sorted2:', trees.sorted[0].children![0]?.children?.length)
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

    return NextResponse.json({ data: (await getSortedTreesList(session?.userId as number, undefined)).sorted, new: id });
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