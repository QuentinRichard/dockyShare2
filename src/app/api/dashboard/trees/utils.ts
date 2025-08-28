import { DockyFileData, DockyFileTypeEnum } from '@/db/schema/dockies';
import { IPropertiesTable, PropertyTreeType } from '@/db/schema/property';
import { getDockies } from '@/repositories/DockiesRepository';


function mergeDockyToTree(dockies: DockyFileData[], trees: Map<number, IPropertiesTable>) {
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

export async function addDockyToTrees(userId: number, trees: Map<number, IPropertiesTable>, type?: DockyFileTypeEnum | null) {
    const dockies = await getDockies(userId, type);
    //La map est construite avec des objets, le Tree utilise des reference sur la map
    // donc je ne retourne pas de valeur ...... 
    // .......
    // je sais peux mieux faire mais cela me rappelle une anecdote ;)

    mergeDockyToTree(dockies, trees);
}