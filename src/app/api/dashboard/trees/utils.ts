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
                    content: dock.slug,
                    parentId: tree.id,
                    children: [],
                })
            }
        }
    })
}

export async function addDockyToTrees(userId: number, trees: Map<number, IPropertiesTable>, type?: DockyFileTypeEnum) {
    const dockies = await getDockies(userId, type);

    mergeDockyToTree(dockies, trees);
}