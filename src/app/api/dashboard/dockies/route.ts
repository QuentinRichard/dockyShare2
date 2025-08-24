import { DockyPutRequestSchema, DockyRequestSchema } from '@/app/lib/interfaces/dockyRequest';
import { TreePutRequestSchema } from '@/app/lib/interfaces/treesRequest';
import { getSession } from '@/app/lib/session';
import { DockyFileDataChildren } from '@/db/schema/dockies';
import { createDocky, deleteDocky, getDockies, getDocky, updateDocky } from '@/repositories/DockiesRepository';
import { NextRequest, NextResponse } from 'next/server';

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
        data: dataBody.data,
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }
    const { name, description, type, data } = validatedFields.data;

    //TODO check User Rules

    const docky = await createDocky({ name, description, type, data, userId: session?.userId! });

    return NextResponse.json(docky);
}

export async function PUT(request: Request) {

    const session = await getSession();

    const dataBody = await request.json();
    const validatedFields = DockyPutRequestSchema.safeParse({
        id: dataBody.id,
        name: dataBody.name,
        description: dataBody.description,
        type: dataBody.type,
        data: dataBody.data,
        children: dataBody.children,
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }
    const { id, name, description, type, data, children } = validatedFields.data;

    // Check if the owner of parent is the user

    const docky = await getDocky(id);
    if (!docky || docky?.userId !== session?.userId) {
        return {
            errors: "Invalide rules",
        }
    }

    await updateDocky({ id, userId: session?.userId, name, description, type, data, children: children as DockyFileDataChildren[] })

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
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }
    const { id } = validatedFields.data;

    // Check if the owner of parent is the user
    const currentTree = await getDocky(id);
    if (!currentTree || currentTree?.userId !== session?.userId) {
        return {
            errors: "Invalide rules",
        }
    }

    await deleteDocky(id);

    return NextResponse.json({ status: "succes" });
}