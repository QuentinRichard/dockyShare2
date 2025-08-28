import { useTreesDefinition } from '@/app/lib/definition';
import dbConnexion from '@/db/connexion';
import { IPropertiesTable, propertiesTable, PropertyTreeType } from '@/db/schema/property';
import { and, eq, inArray } from 'drizzle-orm';
import { console } from 'inspector';



export async function sortTrees(trees: IPropertiesTable[]): Promise<{ flat: Map<number, IPropertiesTable>, sorted: IPropertiesTable[] }> {

  const map = new Map<number, IPropertiesTable>();
  const roots: IPropertiesTable[] = [];

  // Préparer une entrée pour chaque noeud
  trees.forEach(item => {
    map.set(item!.id as number, { ...item, children: [] });
  });

  // Relier enfants ↔ parents
  trees.forEach(item => {
    const node = map.get(item!.id as number);
    if (item.parentId == null) {
      // Racine (pas de parent)
      roots.push(node as IPropertiesTable);
    } else {
      const parent = map.get(item.parentId);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(node as IPropertiesTable);
      }
    }
  });

  return { flat: map, sorted: roots };
}
function getGroupOfType(type: useTreesDefinition) {
  console.log(useTreesDefinition.FullTree, useTreesDefinition.TreeArticle);
  console.log(useTreesDefinition);
  switch (type) {
    case useTreesDefinition[useTreesDefinition.TreeDocky]:
    case useTreesDefinition[useTreesDefinition.FullTreeDocky]:
      return [
        PropertyTreeType.Library, PropertyTreeType.LibraryDocky,
        PropertyTreeType.LibraryDockyDiv, PropertyTreeType.Docky,
      ]
    case useTreesDefinition[useTreesDefinition.TreeArticle]:
    case useTreesDefinition[useTreesDefinition.FullTreeArticle]:
      return [
        PropertyTreeType.Library, PropertyTreeType.LibraryArticle,
        PropertyTreeType.LibraryArticleDiv, PropertyTreeType.Article,
      ]
    case useTreesDefinition[useTreesDefinition.FullTree]:
      return undefined;
    case useTreesDefinition[useTreesDefinition.Tree]:
    //case useTreesDefinition.FullTree:
    default:
      return undefined;
  }
}
export async function getTrees(userId: number, type: useTreesDefinition | undefined): Promise<IPropertiesTable[]> {
  try {
    const typeArray = getGroupOfType(type!);

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
      where: (type && typeArray) ? and(eq(propertiesTable.userId, userId), inArray(propertiesTable.type, typeArray)) : eq(propertiesTable.userId, userId)
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

export async function getSortedTreesList(userId: number, type: useTreesDefinition | undefined) {
  const list = await getTrees(userId, type);
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