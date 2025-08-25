import { IPropertiesTable, PropertyTreeType } from '@/db/schema/property';
import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import { ReactNode } from 'react';

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

export function buildMenu(trees: IPropertiesTable[], expendedId: number, onClick: unknown, toolBarByTypeCB: (id: number, type: PropertyTreeType) => void) {



    const getMenuItemToolBar = (item: IPropertiesTable) => {
        return (<>
            {toolBarByTypeCB(item.id as number, item.type)}
            {/* ExpendSubMenu */}
            {item.children!.length > 0 && item.id === expendedId &&
                <DynamicIcon name="chevron-down" size={44} className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />}

            {item.children!.length > 0 && item.id !== expendedId &&
                <DynamicIcon name="chevron-right" size={44} className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />}
        </>)
    }

    const getMenuItem = (item: IPropertiesTable, index: number, run: number) => {
        return (
            item.children!.length === 0 ?
                <li key={`menu_li-${run.toString().repeat(run)}-${index}`}>
                    <div className={`flex justify-between items-center p-${run} w-full text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}>
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
                    <button type="button" className={`flex items-center w-full p-${run}  text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700`} aria-controls="dropdown-example" data-collapse-toggle="dropdown-example"
                        onClick={() => { onClick(item.id! === expendedId ? 0 : item.id!); }}>
                        {item.icon && item.icon.length > 0 && <DynamicIcon name={item.icon as IconName} size={44} className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />}
                        <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">{item.name}</span>
                        {getMenuItemToolBar(item)}

                    </button>
                    <ul id="dropdown-example" className={`p-${run + 2} py-2 space-y-2`} hidden={!containsSelected(item, expendedId)}>
                        {item.children!.map((child, index2) =>
                            getMenuItem(child, index2, index + 1)
                        )}
                    </ul>
                </li >
        );
    }

    return trees?.map((item: IPropertiesTable, index: number) => {
        return getMenuItem(item, index, 2)
    });

}


export function buildOptionSelection(trees: IPropertiesTable[]): ReactNode {
    const output: unknown = [];
    const getMenuItem = (item: IPropertiesTable, run: number, output: []) => {

        output.push((<option key={`treeDestSelection_${item.id}`} value={item.id} className={`p-${2 + 2 * run}`}>{item.name}</option>) as never)
        item.children?.forEach((child) => {
            return getMenuItem(child, run + 1, output)
        })
    };
    trees?.forEach((item) => {
        getMenuItem(item, 0, output as [])
    });
    return output as unknown as ReactNode;
}