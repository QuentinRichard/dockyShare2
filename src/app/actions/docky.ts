'use server'
import { DockyRequestSchema } from '@/app/lib/interfaces/dockyRequest';
import { getSession } from '@/app/lib/session';
import { createDocky } from '@/repositories/DockiesRepository';
import { redirect } from 'next/navigation';


export async function createDockyAction(formData: FormData) {
    // Validate form fields
    const validatedFields = DockyRequestSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        isPublic: formData.get('is_public') ? 1 : 0,
        type: formData.get('type'),
        cat: formData.get('cat'),
        treeId: Number(formData.get('tree_id')),
    });

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const session = await getSession();

    // Call the provider or db to create a user...
    const { name, description, isPublic, type, cat, treeId } = validatedFields.data;
    // e.g. Hash the user's password before storing it

    await createDocky({
        name,
        slug: 'fake',
        description,
        isPublic,
        type,
        cat,
        treeId,
        data: {},
        userId: session?.userId,
    });

    // 5. Redirect user
    redirect('/dashboard');
}
