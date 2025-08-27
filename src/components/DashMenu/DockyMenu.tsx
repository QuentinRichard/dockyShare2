import { IPropertiesTable, PropertyTreeType } from "@/db/schema/property";
import { DynamicIcon } from "lucide-react/dynamic";
import TreeMenu from "react-simple-tree-menu";
import { Input, ListGroup, ListGroupItem } from "reactstrap";


interface TreeNode {
    key: string;
    label: string;
    nodes?: TreeNode[];
}

export default function DockyMenu(
    onEditAction: (slug: string) => void,
    onAddDivAction: (id: number, type: PropertyTreeType) => void,
    onAddAction: (id: number, typep: PropertyTreeType
    ) => void,
    trees: IPropertiesTable[]) {
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
    }) => (
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
                    {getToolsByType(getTreeByKey(itemKey))}
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

    const getformatedTree = (trees: IPropertiesTable[]) => {
        const formated: TreeNode[] = [];
        return FormatedTree(trees, formated);
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

    const EditTools = (slug: string) => (
        <DynamicIcon name="file-pen-line" size={44}
            className="opacity-0 group-hover:opacity-100 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            onClick={() => { onEditAction(slug) }} />
    );
    const AddTools = (id: number, type: PropertyTreeType) => (
        <DynamicIcon name="list-plus" size={44}
            className="opacity-0 group-hover:opacity-100 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 hover:text-gray-900 dark:group-hover:text-white"
            onClick={() => { onAddAction(id, type) }} />
    );
    const AddDivTools = (id: number, type: PropertyTreeType) => (
        <DynamicIcon name="folder-plus" size={44}
            className="opacity-0 group-hover:opacity-100 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            onClick={() => { onAddDivAction(id, type) }} />
    );

    // const getMenuItemToolBar = (item: IPropertiesTable) => {

    //     return (<>
    //         {getToolsByType(item)}
    //         {/* ExpendSubMenu */}
    //         {item.children && item.children!.length > 0 && item.id === expendedId &&
    //             <DynamicIcon name="chevron-down" size={44} className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />}

    //         {item.children && item.children!.length > 0 && item.id !== expendedId &&
    //             <DynamicIcon name="chevron-right" size={44} className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />}
    //     </>)
    // }

    function getToolsByType(item: IPropertiesTable | undefined) {
        if (!item) return <></>;
        let ret;
        switch (item.type) {
            case PropertyTreeType.Admin:
                ret = (<>{ }</>);
                break;
            case PropertyTreeType.AdminUser:
                ret = (<>{EditTools(item.id ? item.id.toString() : item.content)}</>);
                break;
            case PropertyTreeType.AdminHomePage:
                ret = (<>{EditTools(item.id ? item.id.toString() : item.content)}</>);
                break;
            case PropertyTreeType.AdminLibrary:
                ret = (<>{ }</>);
                break;
            case PropertyTreeType.AdminLibraryDocky:
                ret = (<>{AddTools(item.id as number, item.type)}{AddDivTools(item.id as number, item.type)}</>);
                break;
            case PropertyTreeType.AdminLibraryDockyDiv:
                ret = (<>{AddTools(item.id as number, item.type)}{AddDivTools(item.id as number, item.type)}</>);
                break;
            case PropertyTreeType.AdminDocky:
                ret = (<>{EditTools(item.id ? item.id.toString() : item.content)}</>);
                break;
            case PropertyTreeType.AdminLibraryArticle:
                ret = (<>{AddTools(item.id as number, item.type)}{AddDivTools(item.id as number, item.type)}</>);
                break;
            case PropertyTreeType.AdminLibraryArticleDiv:
                ret = (<>{AddTools(item.id as number, item.type)}{AddDivTools(item.id as number, item.type)}</>);
                break;
            case PropertyTreeType.AdminArticle:
                ret = (<>{EditTools(item.id ? item.id.toString() : item.content)}</>);
                break;
            case PropertyTreeType.Library:
                ret = (<>{ }</>);
                break;
            case PropertyTreeType.LibraryDocky:
                ret = (<>{AddTools(item.id as number, item.type)}{AddDivTools(item.id as number, item.type)}</>);
                break;
            case PropertyTreeType.LibraryDockyDiv:
                ret = (<>{AddTools(item.id as number, item.type)}{AddDivTools(item.id as number, item.type)}</>);
                break;
            case PropertyTreeType.Docky:
                ret = (<>{EditTools(item.id ? item.id.toString() : item.content)}</>);
                break;
            case PropertyTreeType.LibraryArticle:
                ret = (<>{AddTools(item.id as number, item.type)}{AddDivTools(item.id as number, item.type)}</>);
                break;
            case PropertyTreeType.LibraryArticleDiv:
                ret = (<>{AddTools(item.id as number, item.type)}{AddDivTools(item.id as number, item.type)}</>);
                break;
            case PropertyTreeType.Article:
                ret = (<>{EditTools(item.id ? item.id.toString() : item.content)}</>);
                break;
            case PropertyTreeType.Calendar:
                ret = (<>{ }</>);
                break;
            case PropertyTreeType.CalendarHistory:
                ret = (<>{ }</>);
                break;
            case PropertyTreeType.CalendarUpComming:
                ret = (<>{AddTools(item.id as number, item.type)}{AddDivTools(item.id as number, item.type)}</>);
                break;
            case PropertyTreeType.CalendarEvent:
                ret = (<>{EditTools(item.id ? item.id.toString() : item.content)}</>);
                break;
            case PropertyTreeType.Events:
                ret = (<>{EditTools(item.id ? item.id.toString() : item.content)}{AddTools(item.id as number, item.type)}{AddDivTools(item.id as number, item.type)}</>);
                break;
            case PropertyTreeType.EventsDiv:
                ret = (<>{AddTools(item.id as number, item.type)}{AddDivTools(item.id as number, item.type)}</>);
                break;
            case PropertyTreeType.Event:
                ret = (<>{EditTools(item.id ? item.id.toString() : item.content)}</>);
                break;
            default:
                throw new Error('PropertyTreeType Type Unknown !!')
        }
        return ret;
    }
    return (
        <TreeMenu
            data={getformatedTree(trees)}
            onClickItem={({ key, label, ...props }) => {
                console.log(`TreeMenu Click: ${key}, ${label}, ${JSON.stringify(props)}`);
            }}
            debounceTime={125}
        >
            {({ search, items }) => {
                return (
                    <>
                        <Input
                            onChange={(e) => search(e.target.value)}
                            placeholder="Search element.."
                        />
                        <ListGroup>
                            {items.map((props) => {
                                props.itemKey = props.key;
                                const newProps = { ...props, key: undefined };
                                delete newProps.key;
                                return (
                                    // You might need to wrap the third-party component to consume the props
                                    // check the story as an example
                                    // https://github.com/iannbing/react-simple-tree-menu/blob/master/stories/index.stories.js
                                    // <ListGroupItem {...props}> {props.label} </ListGroupItem>
                                    <ListItem key={`li_${props.key}`} {...newProps} />
                                )
                            })}
                        </ListGroup>
                    </>
                );
            }}
        </TreeMenu>
    );
};