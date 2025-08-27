import { DockyFileCatEnum, DockyFileData } from '@/db/schema/dockies';
import { IPropertiesTable, PropertyTreeType } from '@/db/schema/property';
import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import { ReactNode } from 'react';

export interface DataMenu {
    trees: IPropertiesTable[],
    articles: DockyFileData[],
    dockies: DockyFileData[],
}

const containsSelected = (item: IPropertiesTable, selected: number) => {
    if (item.id === selected)
        return true
    else {
        let ret = false;
        item.children?.forEach(child => {
            if (containsSelected(child, selected))
                ret = true;
        });
        return ret;
    }
}
function getTypeForDockyTree(type: PropertyTreeType) {
    switch (type) {
        case PropertyTreeType.AdminLibraryArticle:
        case PropertyTreeType.AdminLibraryArticleDiv:
            return PropertyTreeType.AdminArticle
            break;
        case PropertyTreeType.AdminLibraryDocky:
        case PropertyTreeType.LibraryDockyDiv:
            return PropertyTreeType.AdminDocky
            break;


        case PropertyTreeType.LibraryArticle:
        case PropertyTreeType.LibraryArticleDiv:
            return PropertyTreeType.Article
            break;
        case PropertyTreeType.LibraryDocky:
        case PropertyTreeType.LibraryDockyDiv:
            return PropertyTreeType.Docky
            break;
        default:
            console.log(`Type unknown for getTypeForDockyTree :${type}`);
            return "";
            break;
    }
}

function findDockyFileForTreesId(id: number, type: PropertyTreeType, dockies: DockyFileData[]) {
    if (!dockies) return [];
    const ret: IPropertiesTable[] = [];
    console.log(`search for treeID ${id}, docky length ${dockies.length}`)
    dockies.forEach((d) => {
        if (d.treeId === id) {
            console.log(`found docky ${d.id}`)
            ret.push({
                name: d.name,
                type: getTypeForDockyTree(type),
                content: d.slug,
                parentId: id,
            })
        }
    })
    return;
}
function getDockeyData(type: PropertyTreeType, dockies: DockyFileData[], article: DockyFileData[]) {

    switch (type) {
        case PropertyTreeType.AdminLibraryArticle:
        case PropertyTreeType.AdminLibraryArticleDiv:
        case PropertyTreeType.LibraryArticle:
        case PropertyTreeType.LibraryArticleDiv:
            console.log(`TgetDockeyData return article`);
            return article;
            break;
        case PropertyTreeType.AdminLibraryDocky:
        case PropertyTreeType.LibraryDockyDiv:
        case PropertyTreeType.LibraryDocky:
        case PropertyTreeType.LibraryDockyDiv:
            console.log(`TgetDockeyData return dockies`);
            return dockies;
            break;
        default:
            console.log(`Type unknown for getDockeyData ${type}`);
            break;
    }
    return undefined;
}

function populateDocky(trees: IPropertiesTable[], dockies: DockyFileData[], articles: DockyFileData[],) {

    trees?.forEach((tree) => {
        if (tree.children && tree.children?.length === 0) {
            const docky = findDockyFileForTreesId(tree.id, tree.type, getDockeyData(tree.type, dockies, articles))
            tree.children = docky;
        } else {
            if (tree.children)
                populateDocky(tree.children, dockies, articles)
        }
    })
}

export function buildMenu(data: DataMenu, expendedId: number, onClick: (val: number) => void, toolBarByTypeCB: (item: IPropertiesTable) => void) {

    populateDocky(data.trees, data.dockies, data.articles);

    const getMenuItemToolBar = (item: IPropertiesTable) => {
        return (<>
            {toolBarByTypeCB(item)}
            {/* ExpendSubMenu */}
            {item.children && item.children!.length > 0 && item.id === expendedId &&
                <DynamicIcon name="chevron-down" size={44} className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />}

            {item.children && item.children!.length > 0 && item.id !== expendedId &&
                <DynamicIcon name="chevron-right" size={44} className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />}
        </>)
    }

    const getMenuItem = (item: IPropertiesTable, index: number, run: number) => {
        return (
            (!item!.children || item!.children!.length) === 0 ?
                <li key={`menu_li-${run.toString().repeat(run)}-${index}`}>
                    <div className={`flex justify-between items-center pl-${run} w-full text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}>
                        <div className='flex'>
                            {item.icon && item.icon.length > 0 &&
                                <DynamicIcon name={item.icon as IconName} size={44} className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />}
                            <span className="ms-3">{item.name}</span>
                        </div>
                        <div className='flex'>
                            {getMenuItemToolBar(item)}
                        </div>
                    </div>
                </li>
                :
                <li key={`menu_li-${run.toString().repeat(run)}-${index}`}>
                    <button type="button" className={`flex items-center w-full pl-${run}  text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700`} aria-controls="dropdown-example" data-collapse-toggle="dropdown-example"
                        onClick={() => { onClick(item.id! === expendedId ? 0 : item.id!); }}>
                        {item.icon && item.icon.length > 0 && <DynamicIcon name={item.icon as IconName} size={44} className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />}
                        <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">{item.name}</span>
                        {getMenuItemToolBar(item)}

                    </button>
                    <ul id="dropdown-example" className={`pl-${run + 2} py-2 space-y-2`} hidden={!containsSelected(item, expendedId)}>
                        {item!.children && item!.children!.map((child, index2) =>
                            getMenuItem(child, index2, run + index2 + index + 2)
                        )}
                    </ul>
                </li >
        );
    }

    return data.trees?.map((item: IPropertiesTable, index: number) => {
        return getMenuItem(item, index, 2)
    });

}


export function buildOptionSelection(trees: IPropertiesTable[]): ReactNode {
    const output: unknown = [];
    const getMenuItem = (item: IPropertiesTable, run: number, output: []) => {

        output.push((<option key={`treeDestSelection_${item.id ? item.id : item.content}`} value={item.id} className={`pl-${2 + 2 * run}`}>{item.name}</option>) as never)
        item.children?.forEach((child) => {
            return getMenuItem(child, run + 1, output)
        })
    };
    trees?.forEach((item) => {
        getMenuItem(item, 0, output as [])
    });
    return output as unknown as ReactNode;
}




export function buildOptionSelectionforArticleCat(): ReactNode {
    const cat = [
        { name: "Un fichier Mardown", id: DockyFileCatEnum.Article_MD },
        { name: "Tableau de dessin", id: DockyFileCatEnum.Article_Board },
        { name: "Une Image", id: DockyFileCatEnum.Article_IMG },
        { name: "Un fichier Audio", id: DockyFileCatEnum.Article_AUDIO },
        { name: "Un fichier Vidéo", id: DockyFileCatEnum.Article_VIDEO },
        { name: "Un questionnaire", id: DockyFileCatEnum.Article_Survey }
    ]
    const output: unknown[] = [];
    cat.forEach((item, index) => {
        output.push((<option key={`arcitcleCat_${index}`} value={item.id} className="pl-2">{item.name}</option>) as unknown)
    });
    return output as unknown as ReactNode;
}