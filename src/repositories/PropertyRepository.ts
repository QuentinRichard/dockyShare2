import dbConnexion from '@/db/connexion';
import { IPropertiesTable, propertiesTable } from '@/db/schema/property';
import { eq } from 'drizzle-orm';
import { console } from 'inspector';



export async function sortTrees(trees: IPropertiesTable[]): Promise<IPropertiesTable[]> {

  const map = new Map();
  const roots: IPropertiesTable[] = [];

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

export async function getTrees(userId: number): Promise<IPropertiesTable[]> {
  try {
    const result = await dbConnexion.query.propertiesTable.findMany({
      // with: {
      //   parentId: true,   // liste des users invités par ce user
      //   children: true,    // user qui a invité ce user
      // },
      columns: {
        id: true,
        name: true,
        icon: true,
        type: true,
        content: true,
        parentId: true,
      },
      where: eq(propertiesTable.userId, userId)
    });
    return result as unknown as IPropertiesTable[];
  } catch (e) {
    console.log(e);
    return []
  }
}

export async function getTree(treeId: number): Promise<IPropertiesTable | undefined> {
  try {
    const result = await dbConnexion.query.propertiesTable.findFirst({
      where: eq(propertiesTable.id, treeId),
      columns: {
        id: true,
        name: true,
        icon: true,
        type: true,
        content: true,
        parentId: true,
      },
    });
    return result as IPropertiesTable;
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
    icon: property.icon,
    type: property.type,
    content: property.content,
    parentId: property.parentId,
    userId: property.userId,
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