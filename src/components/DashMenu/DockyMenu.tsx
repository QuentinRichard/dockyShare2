import { IPropertiesTable, PropertyTreeType } from "@/db/schema/property";
import { DynamicIcon } from "lucide-react/dynamic";
import { ReactNode } from "react";
import TreeMenu from "react-simple-tree-menu";
import { Input, ListGroup, ListGroupItem } from "reactstrap";


interface TreeNode {
    key: string;
    label: string;
    nodes?: TreeNode[];
}

interface ListItemProps {
    level?: number;
    hasNodes?: boolean;
    isOpen?: boolean;
    label?: string;
    itemKey?: string | number;
    searchTerm?: string;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    openNodes?: any; // Replace 'any' with a more specific type if possible
    toggleNode?: () => void;
    matchSearch?: boolean;
    focused?: boolean;
    // Add any other props you expect
    /* eslint-disable @typescript-eslint/no-explicit-any */
    [key: string]: any; // Optional: allows extra props
}
export interface DockyMenuAction {
    onEditAction?: ((slug: string) => void),
    onViewAction?: ((slug: string) => void),
    onAddDivAction?: ((id: number, type: PropertyTreeType) => void),
    onAddAction?: ((id: number, typep: PropertyTreeType) => void),
    onClickAction?: ((id: number | string) => void),

}

export default function DockyMenu(
    trees: IPropertiesTable[],
    action: DockyMenuAction,
    activeSlug?: string
) {
    const ListItem = ({
        level = 0,
        hasNodes,
        isOpen,
        label,
        itemKey,
        searchTerm,
        openNodes,
        toggleNode,
        matchSearch,
        focused,
        ...props
    }: ListItemProps) => (
        <ListGroupItem
            {...props}
            style={{
                paddingLeft: DEFAULT_PADDING + ICON_SIZE + level * LEVEL_SPACE,
                cursor: 'pointer',
                boxShadow: focused ? '0px 0px 5px 0px #222' : 'none',
                zIndex: focused ? 999 : 'unset',
                position: 'relative',
            }}
        >
            <div className={`flex justify-between items-center pl-2 w-full text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group`}>
                <div className='flex'>

                    {hasNodes &&
                        <div onClick={e => {
                            hasNodes && toggleNode && toggleNode();
                            e.stopPropagation();
                        }}>
                            {isOpen &&
                                <DynamicIcon name="chevron-down" size={20} className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />}

                            {!isOpen &&
                                < DynamicIcon name="chevron-right" size={20} className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />}
                        </div>
                    }
                    {!hasNodes &&
                        <span style={{ marginRight: '8px', whiteSpace: 'pre-wrap' }}>{'  '}</span>}

                    <span className={`ms-3`}>{label}</span>
                </div>
                <div className='flex'>
                    {getToolsByType(getTreeByKey(itemKey as string))}
                </div>
            </div>
        </ListGroupItem >
    );
    const FormatedTree = (trees: IPropertiesTable[], formated: TreeNode[]) => {
        trees.forEach(t => {
            formated.push({
                key: t.content!.length ? t.content : t.id!.toString(),
                label: t.name,
                nodes: t.children ? FormatedTree(t.children, []) : undefined
            } as TreeNode);
        })
        return formated;
    }

    const getFormatedTree = (trees: IPropertiesTable[]) => {
        const formated: TreeNode[] = [];
        const result = FormatedTree(trees, formated);
        return result;
    }

    const DEFAULT_PADDING = 8;
    const ICON_SIZE = 8;
    const LEVEL_SPACE = 8;

    const getTreeByKey = (key: string): IPropertiesTable | undefined => {
        const fKey = key.split('/').at(-1);
        if (!trees) return undefined;
        let ret: IPropertiesTable | undefined = undefined;
        const findTree = (trees: IPropertiesTable[]) => {
            for (let i = 0; i < trees.length; i++) {
                const t = trees[i];
                if (t.content === fKey || t.id?.toString() === fKey) {
                    ret = t;
                    return;
                }
                if (t.children && t.children.length > 0) {
                    findTree(t.children);
                }
            }
        }
        findTree(trees);
        return ret;
    }


    const ViewTools = (slug: string) => (
        <DynamicIcon name="receipt-text" size={44}
            className="opacity-0 group-hover:opacity-100 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            onClick={() => { if (action.onViewAction) action.onViewAction(slug) }} />
    );
    const EditTools = (slug: string) => (
        <DynamicIcon name="file-pen-line" size={44}
            className="opacity-0 group-hover:opacity-100 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            onClick={() => { if (action.onEditAction) action.onEditAction(slug) }} />
    );
    const AddTools = (id: number, type: PropertyTreeType) => (
        <DynamicIcon name="list-plus" size={44}
            className="opacity-0 group-hover:opacity-100 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 hover:text-gray-900 dark:group-hover:text-white"
            onClick={() => { if (action.onAddAction) action.onAddAction(id, type) }} />
    );
    const AddDivTools = (id: number, type: PropertyTreeType) => (
        <DynamicIcon name="folder-plus" size={44}
            className="opacity-0 group-hover:opacity-100 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            onClick={() => { if (action.onAddDivAction) action.onAddDivAction(id, type) }} />
    );

    const getActiveSlug = (slug: string) => {
        return slug;
    }

    enum ToolsTypes {
        ViewAction,
        EditAction,
        AddAction,
        DivAction,
    }
    function getToolsTypes(tab: ToolsTypes[], item: IPropertiesTable): ReactNode[] {
        const ret: ReactNode[] = [];
        tab.forEach((rule) => {
            if (rule === ToolsTypes.EditAction && EditTools)
                ret.push(EditTools(item.id ? item.id.toString() : item.content))
            if (rule === ToolsTypes.ViewAction && ViewTools)
                ret.push(ViewTools(item.id ? item.id.toString() : item.content))
            if (rule === ToolsTypes.EditAction && AddTools)
                ret.push(AddTools(item.id as number, item.type))
            if (rule === ToolsTypes.DivAction && action.onAddDivAction)
                ret.push(AddDivTools(item.id as number, item.type))
        })
        return ret;
    }

    function getToolsByType(item: IPropertiesTable | undefined) {
        if (!item) return <></>;
        let ret;
        switch (item.type) {
            case PropertyTreeType.Admin:
                ret = (<>{ }</>);
                break;
            case PropertyTreeType.AdminUser:
                ret = (<>{getToolsTypes([ToolsTypes.EditAction], item)}</>);
                break;
            case PropertyTreeType.AdminHomePage:
                ret = (<>{getToolsTypes([ToolsTypes.EditAction], item)}</>);
                break;
            case PropertyTreeType.AdminLibrary:
                ret = (<>{ }</>);
                break;
            case PropertyTreeType.AdminLibraryDocky:
                ret = (<>{getToolsTypes([ToolsTypes.AddAction, ToolsTypes.DivAction], item)}</>);
                break;
            case PropertyTreeType.AdminLibraryDockyDiv:
                ret = (<>{getToolsTypes([ToolsTypes.AddAction, ToolsTypes.DivAction], item)}</>);
                break;
            case PropertyTreeType.AdminDocky:
                ret = (<>{getToolsTypes([ToolsTypes.ViewAction, ToolsTypes.EditAction], item)}</>);
                break;
            case PropertyTreeType.AdminLibraryArticle:
                ret = (<>{getToolsTypes([ToolsTypes.AddAction, ToolsTypes.DivAction], item)}</>);
                break;
            case PropertyTreeType.AdminLibraryArticleDiv:
                ret = (<>{getToolsTypes([ToolsTypes.AddAction, ToolsTypes.DivAction], item)}</>);
                break;
            case PropertyTreeType.AdminArticle:
                ret = (<>{getToolsTypes([ToolsTypes.ViewAction, ToolsTypes.EditAction], item)}</>);
                break;
            case PropertyTreeType.Library:
                ret = (<>{ }</>);
                break;
            case PropertyTreeType.LibraryDocky:
                ret = (<>{getToolsTypes([ToolsTypes.AddAction, ToolsTypes.DivAction], item)}</>);
                break;
            case PropertyTreeType.LibraryDockyDiv:
                ret = (<>{getToolsTypes([ToolsTypes.AddAction, ToolsTypes.DivAction], item)}</>);
                break;
            case PropertyTreeType.Docky:
                ret = (<>{getToolsTypes([ToolsTypes.ViewAction, ToolsTypes.EditAction], item)}</>);
                break;
            case PropertyTreeType.LibraryArticle:
                ret = (<>{getToolsTypes([ToolsTypes.AddAction, ToolsTypes.DivAction], item)}</>);
                break;
            case PropertyTreeType.LibraryArticleDiv:
                ret = (<>{getToolsTypes([ToolsTypes.AddAction, ToolsTypes.DivAction], item)}</>);
                break;
            case PropertyTreeType.Article:
                ret = (<>{getToolsTypes([ToolsTypes.ViewAction, ToolsTypes.EditAction], item)}</>);
                break;
            case PropertyTreeType.Calendar:
                ret = (<>{ }</>);
                break;
            case PropertyTreeType.CalendarHistory:
                ret = (<>{ }</>);
                break;
            case PropertyTreeType.CalendarUpComming:
                ret = (<>{getToolsTypes([ToolsTypes.ViewAction, ToolsTypes.AddAction, ToolsTypes.DivAction], item)}</>);
                break;
            case PropertyTreeType.CalendarEvent:
                ret = (<>{getToolsTypes([ToolsTypes.ViewAction, ToolsTypes.EditAction], item)}</>);
                break;
            case PropertyTreeType.Events:
                ret = (<>{getToolsTypes([ToolsTypes.ViewAction, ToolsTypes.EditAction, ToolsTypes.AddAction, ToolsTypes.DivAction], item)}</>);
                break;
            case PropertyTreeType.EventsDiv:
                ret = (<>{getToolsTypes([ToolsTypes.AddAction, ToolsTypes.DivAction], item)}</>);
                break;
            case PropertyTreeType.Event:
                ret = (<>{getToolsTypes([ToolsTypes.ViewAction, ToolsTypes.EditAction], item)}</>);
                break;
            default:
                throw new Error('PropertyTreeType Type Unknown !!')
        }
        return ret;
    }
    return (
        <TreeMenu
            data={getFormatedTree(trees)}
            activeKey={activeSlug ?? getActiveSlug(activeSlug!)}
            onClickItem={({ key, label, ...props }) => {
                if (action.onClickAction) action.onClickAction(key);

            }}
            debounceTime={125}
        >
            {({ search, items }) => {
                return (
                    <>
                        <Input
                            onChange={(e) => search && search(e.target.value)}
                            placeholder="Search element.."
                        />
                        <ListGroup>
                            {items.map((props, index) => {
                                props.itemKey = props.key;
                                //const newProps = { ...props, key: undefined };
                                //delete newProps.key;
                                const { key, ...newProps } = props; // <-- retire complètement la clé 'key'
                                return (
                                    // You might need to wrap the third-party component to consume the props
                                    // check the story as an example
                                    // https://github.com/iannbing/react-simple-tree-menu/blob/master/stories/index.stories.js
                                    // <ListGroupItem {...props}> {props.label} </ListGroupItem>
                                    <ListItem key={`li_${props.key}-${index}}`} {...newProps} />
                                )
                            })}
                        </ListGroup>
                    </>
                );
            }}
        </TreeMenu>
    );
};