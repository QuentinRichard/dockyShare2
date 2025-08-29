import { mergeDockyToTree } from '@/app/lib/definition';
import { DockyFileTypeEnum } from '@/db/schema/dockies';
import { IPropertiesTable } from '@/db/schema/property';
import { getDockies } from '@/repositories/DockiesRepository';


export async function addDockyToTrees(userId: number, trees: Map<number, IPropertiesTable>, type?: DockyFileTypeEnum | null) {
    const dockies = await getDockies(userId, type);
    //La map est construite avec des objets, le Tree utilise des reference sur la map
    // donc je ne retourne pas de valeur ...... 
    // .......
    // je sais peux mieux faire mais cela me rappelle une anecdote ;)

    mergeDockyToTree(dockies, trees);
}