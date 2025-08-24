import dbConnexion from '@/db/connexion';
import { DockyFileData, DockyFileTypeEnum, dockiesTable } from '@/db/schema/dockies';
import { and, eq } from 'drizzle-orm';


export async function getArticles(userId: number): Promise<DockyFileData[]> {
    try {
        const rows = await dbConnexion
            .select()
            .from(dockiesTable)
            .where(and(eq(dockiesTable.userId, userId), eq(dockiesTable.type, DockyFileTypeEnum.Article)));

        rows.forEach(e => console.log(JSON.stringify(e)));

        return rows as DockyFileData[];
    } catch (e) {
        console.log(e);
        return []
    }
}

export async function getArticle(dockyId: number): Promise<DockyFileData | undefined> {
    try {
        const rows = await dbConnexion
            .select()
            .from(dockiesTable)
            .where(eq(dockiesTable.id, dockyId));

        return rows![0] as DockyFileData;
    } catch (e) {
        console.log(e);
        return undefined;
    }
}

