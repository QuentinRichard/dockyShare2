import dbConnexion from '@/db/connexion';
import { DockyFileChildren, DockyFileData, DockyFileTypeEnum, UpdateDockyFileData, dockiesChildrenTable, dockiesTable } from '@/db/schema/dockies';
import { and, eq, like } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
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

        //QRI must be checked
        const ret: DockyFileData[] = [];
        [...map.values()]
            .forEach((item: DockyFileData) => {
                if (!type || item.type === type)
                    ret.push(item);
            });

        return ret;


    } catch (e) {
        console.log(e);
        return []
    }
}

export async function getDocky(dockyId: number): Promise<DockyFileData | undefined> {
    try {
        const rows = await dbConnexion
            .select()
            .from(dockiesTable)
            .where(eq(dockiesTable.id, dockyId));

        return rows.length ? rows[0]! as DockyFileData : undefined;
    } catch (e) {
        console.log(e);
        return undefined;
    }
}

export async function getFullDockyBySlugOrId(slug: string | undefined, id?: number): Promise<DockyFileData | undefined> {
    try {

        const dockiesChildTable = alias(dockiesTable, 'docky_child');
        const rows = await dbConnexion
            .select({
                parent: dockiesTable,
                relation: dockiesChildrenTable,
                child: dockiesChildTable, // <-- ici on sélectionne bien l'enfant
            })
            .from(dockiesTable)
            .leftJoin(
                dockiesChildrenTable,
                eq(dockiesChildrenTable.parentId, dockiesTable.id)
            )
            .leftJoin(
                dockiesChildTable,
                eq(dockiesChildrenTable.childId, dockiesChildTable.id)
            )
            .where(slug ? eq(dockiesTable.slug, slug) : id ? eq(dockiesTable.id, id) : eq(dockiesTable.id, -1));

        if (!rows.length) return undefined;

        // Le parent est toujours le même, les enfants sont dans les lignes
        const parent = rows[0].parent;
        const children = rows
            .map(row => row.child)
            .filter(child => !!child);

        return {
            ...(parent as DockyFileData),
            children,
        } as unknown as DockyFileData;

    } catch (e) {
        console.log(e);
        return undefined;
    }
}


export async function createDocky(docky: DockyFileData): Promise<number> {
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