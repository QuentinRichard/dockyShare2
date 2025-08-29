
// Tree => structure only, FullTree => structure + all doky

import { DockyFileData } from "@/db/schema/dockies";
import { IPropertiesTable, PropertyTreeType } from "@/db/schema/property";

// TreeXXX => structure only for XXX type, FullTree => structure + all doky of type XXX
export enum useTreesDefinition {
    Tree = 'Tree',
    TreeDocky = 'TreeDocky',
    TreeArticle = 'TreeArticle',
    FullTree = 'FullTree',
    FullTreeDocky = 'FullTreeDocky',
    FullTreeArticle = 'FullTreeArticle'
};




export function mergeDockyToTree(dockies: DockyFileData[], trees: Map<number, IPropertiesTable>) {
    dockies.forEach((dock: DockyFileData) => {
        if (dock.treeId && trees.has(dock.treeId)) {
            const tree = trees.get(dock.treeId);
            if (tree) {
                let propType = PropertyTreeType.Docky;
                if (tree.type === PropertyTreeType.AdminLibraryDocky || tree.type === PropertyTreeType.AdminLibraryDockyDiv) {
                    propType = PropertyTreeType.AdminDocky;
                }
                tree.children?.push({
                    name: dock.name,
                    icon: 'book-marked',
                    type: propType,
                    content: dock.slug as string,
                    parentId: tree.id,
                    children: [],
                })
            }
        }
    })
}

export function buildFullTree(trees: IPropertiesTable[], dockies: DockyFileData[], articles: DockyFileData[]) {

    console.log("### Calling buildFullTree");
    const fullTree: IPropertiesTable[] = trees.slice();

    const map = new Map<number, IPropertiesTable>();
    const flattenTreesToMap = (tree: IPropertiesTable[]) => {
        tree.forEach(item => {
            map.set(item!.id as number, { ...item });
            if (item.children!.length > 0)
                flattenTreesToMap(item.children!)
        });
    }
    flattenTreesToMap(fullTree);

    mergeDockyToTree(dockies, map);
    mergeDockyToTree(articles, map);

    return fullTree;
}