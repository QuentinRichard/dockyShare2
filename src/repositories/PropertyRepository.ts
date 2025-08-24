import dbConnexion from '@/db/connexion';
import { IPropertiesTable, propertiesTable } from '@/db/schema/property';
import { eq } from 'drizzle-orm';
import { console } from 'inspector';

// export interface TreesRecord {
//   /* eslint-disable @typescript-eslint/no-explicit-any */
//   [x: string]: any;
//   invitees: never;
//   inviter: never;
// }

export interface TreesRecord {
  name: string;
  id: number;
  content: string | null;
  parentId?: number | null;
  userId: number | null;
  children?: TreesRecord[];
}

export async function sortTrees(trees: TreesRecord[]): Promise<TreesRecord[]> {

  const map = new Map();
  const roots: TreesRecord[] = [];

  // Préparer une entrée pour chaque noeud
  trees.forEach(item => {
    map.set(item.id, { ...item, children: [] });
  });

  // Relier enfants ↔ parents
  trees.forEach(item => {
    const node = map.get(item.id);
    if (item.parentId == null) {
      // Racine (pas de parent)
      roots.push(node);
    } else {
      const parent = map.get(item.parentId);
      if (parent) {
        parent.children.push(node);
      }
    }
  });

  return roots;
}

export async function getTrees(userId: number): Promise<TreesRecord[]> {
  try {
    const result = await dbConnexion.query.propertiesTable.findMany({
      // with: {
      //   parentId: true,   // liste des users invités par ce user
      //   children: true,    // user qui a invité ce user
      // },
      where: eq(propertiesTable.userId, userId)
    });
    return result;
  } catch (e) {
    console.log(e);
    return []
  }
}

export async function getTree(treeId: number): Promise<TreesRecord | undefined> {
  try {
    const result = await dbConnexion.query.propertiesTable.findFirst({
      where: eq(propertiesTable.userId, treeId)
    });
    return result;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

export async function getSortedTreesList(userId: number) {
  const list = await getTrees(userId);
  return await sortTrees(list);
}

export async function addTree(property: IPropertiesTable): Promise<number> {
  const newRule: typeof propertiesTable.$inferInsert = {
    name: property.name,
    content: property.content,
    userId: property.userId,
    parentId: property.parentId
  };

  const id = await dbConnexion.insert(propertiesTable).values(newRule).returning({ id: propertiesTable.id });
  return id[0].id;
}

export async function updateTree(property: IPropertiesTable): Promise<number | undefined> {
  const id = property.id;
  property.id = undefined;
  await dbConnexion.update(propertiesTable).set({ ...property }).where(eq(propertiesTable.id, id!));
  return id;
}

export async function deleteTree(id: number): Promise<number | undefined> {
  await dbConnexion.delete(propertiesTable).where(eq(propertiesTable.id, id!));
  return id;
}