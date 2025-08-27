import dbConnexion from '@/db/connexion';
import { DockyFileChildren, DockyFileData, DockyFileTypeEnum, UpdateDockyFileData, dockiesChildrenTable, dockiesTable } from '@/db/schema/dockies';
import { and, eq, like } from 'drizzle-orm';
import { generateSlug } from "random-word-slugs";
import slug from 'slug';


export async function getDockySlug(name: string) {
    const nameSlug = slug(name);
    let nameSlugFinal = slug(name);
    const test1 = await dbConnexion
        .select()
        .from(dockiesTable)
        .where(eq(dockiesTable.slug, nameSlug));
    if (test1.length) {
        const count = await dbConnexion
            .select()
            .from(dockiesTable)
            .where(like(dockiesTable.slug, nameSlug));
        nameSlugFinal = `${nameSlug}${count.length}`;
        const test2 = await dbConnexion
            .select()
            .from(dockiesTable)
            .where(eq(dockiesTable.slug, nameSlugFinal));
        if (test2.length) {
            return generateSlug();
        }
    }
    return nameSlugFinal;

}

export async function getDockies(userId: number, type?: DockyFileTypeEnum | null): Promise<DockyFileData[]> {
    try {
        const rows = await dbConnexion
            .select()
            .from(dockiesTable)
            .leftJoin(dockiesChildrenTable, eq(dockiesChildrenTable.childId, dockiesTable.id))
            .where(type ? and(eq(dockiesTable.userId, userId), eq(dockiesTable.type, type)) : eq(dockiesTable.userId, userId));
        const map = new Map();

        rows.forEach(e => console.log(JSON.stringify(e)));

        // Crée les noeuds
        rows.forEach(({ dockies }) => {
            if (!map.has(dockies!.id)) {
                map.set(dockies!.id, { ...dockies, children: [] });
            }
        });

        // Relie parent ↔ enfant
        rows.forEach(({ dockies_children }) => {
            if (dockies_children?.parentId && dockies_children?.childId) {
                const parent = map.get(dockies_children.parentId);
                const child = map.get(dockies_children.childId);
                if (parent && child) {
                    parent.children.push(child);
                }
            }
        });

        const ret: DockyFileData[] = [];
        [...map.values()]
            .forEach((item: DockyFileData) => {
                if (!type || item.type === type)
                    ret.push(item);
            });

        return ret;

        //return map.get(dockyId);        
        // const result = await dbConnexion.execute(sql`
        //   WITH RECURSIVE docky_tree AS (
        //     SELECT d.*, dc.parent_id, dc.child_id
        //     FROM dockies d
        //     LEFT JOIN dockies_children dc ON d.id = dc.child_id
        //     WHERE d.user_id = ${userId}

        //     UNION ALL

        //     SELECT d.*, dc.parent_id, dc.child_id
        //     FROM dockies d
        //     JOIN dockies_children dc ON d.id = dc.child_id
        //     JOIN docky_tree t ON dc.parent_id = t.id
        //   )
        //   SELECT * FROM docky_tree;
        // `)
        // return result as unknown as DockyFileData[];
    } catch (e) {
        console.log(e);
        return []
    }
}

export async function getDocky(dockyId: number): Promise<DockyFileData | undefined> {
    try {
        const rows = await dbConnexion
            .select()
            .from(dockiesChildrenTable)
            .leftJoin(dockiesTable, eq(dockiesChildrenTable.childId, dockiesTable.id))
            .where(eq(dockiesChildrenTable.parentId, dockyId));
        const map = new Map();

        // Crée les noeuds
        rows.forEach(({ dockies }) => {
            if (!map.has(dockies!.id)) {
                map.set(dockies!.id, { ...dockies, children: [] });
            }
        });

        // Relie parent ↔ enfant
        rows.forEach(({ dockies_children }) => {
            if (dockies_children?.parentId && dockies_children?.childId) {
                const parent = map.get(dockies_children.parentId);
                const child = map.get(dockies_children.childId);
                if (parent && child) {
                    parent.children.push(child);
                }
            }
        });

        return map.get(dockyId);
    } catch (e) {
        console.log(e);
        return undefined;
    }
}



export async function createDocky(docky: DockyFileData): Promise<number> {
    // const newDocky: typeof dockiesTable.$inferInsert = {
    //     name: docky.name,
    //     description: docky.description,
    //     type: docky.type,
    //     data: docky.data,
    //     userId: docky.userId,
    // };

    const slug = await getDockySlug(docky.name);
    docky.slug = slug;
    const id = await dbConnexion.insert(dockiesTable).values(docky).returning({ id: dockiesTable.id });
    return id[0].id;
}

export async function updateDocky(docky: UpdateDockyFileData): Promise<number | undefined> {
    const id = docky.id;
    docky.id = undefined;
    await dbConnexion.update(dockiesTable).set({ ...docky }).where(eq(dockiesTable.id, id!));

    //TODO check if the owner of the dockey 
    await dbConnexion.delete(dockiesChildrenTable).where(eq(dockiesChildrenTable.parentId, docky.id!));
    if (docky.children!.length) {
        const children: DockyFileChildren[] = docky.children!.map((item, index) => {
            return {
                order: index,
                parentId: id!,
                childId: item.id!
            };
        });
        await dbConnexion.insert(dockiesChildrenTable).values(children);
    }


    return id;
}

export async function deleteDocky(id: number): Promise<number | undefined> {
    //TODO check if the owner of the dockey 
    await dbConnexion.delete(dockiesTable).where(eq(dockiesTable.id, id));
    await dbConnexion.delete(dockiesChildrenTable).where(eq(dockiesChildrenTable.parentId, id));
    return id;
}