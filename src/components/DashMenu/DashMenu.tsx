import { useDockyShareContext } from '@/app/dashboard/context';
import { IPropertiesTable, PropertyTreeType } from '@/db/schema/property';
import { DynamicIcon } from 'lucide-react/dynamic';
import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateModal, { getModalType, ModalProps } from '../Modal/CreateModal';
import { buildMenu } from './menuBuilder';

export interface DashMenuProps {
    navigation: (dockySlug: string) => void
}

export default function DashMenu(props: DashMenuProps) {
    const [expendedId, setExpendedId] = useState(0);
    const [modalProps, setModalProps] = useState({} as ModalProps)
    const { trees } = useDockyShareContext();


    const onEditAction = (slug: string) => {
        props!.navigation(slug);
    }

    const onAddDivAction = (id: number, type: PropertyTreeType) => {
        setModalProps({
            action: onModalActionResult,
            open: true,
            type: 'Div',
            data: {
                trees,
                type,
                parentId: id
            },
            title: 'Ajouter un niveau'
        });
    }

    const onAddAction = (id: number, typep: PropertyTreeType) => {
        const type = getModalType(typep);
        setModalProps({
            action: onModalActionResult,
            open: true,
            type,
            data: {
                trees,
                id
            },
            title: 'Ajouter un élèment'
        });
    }

    const onModalActionResult = (state: boolean, msg: string) => {
        setModalProps({ ...modalProps, open: false });
        if (state)
            toast.success(msg);
        else
            toast.error(msg);
    }

    const EditTools = (slug: string) => (<DynamicIcon name="file-pen-line" size={44}
        className="opacity-0 group-hover:opacity-100 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        onClick={() => { onEditAction(slug) }} />);
    const AddTools = (id: number, type: PropertyTreeType) => (<DynamicIcon name="list-plus" size={44}
        className="opacity-0 group-hover:opacity-100 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 hover:text-gray-900 dark:group-hover:text-white"
        onClick={() => { onAddAction(id, type) }} />);
    const AddDivTools = (id: number, type: PropertyTreeType) => (<DynamicIcon name="folder-plus" size={44}
        className="opacity-0 group-hover:opacity-100 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        onClick={() => { onAddDivAction(id, type) }} />);

    //TODO slug must be manage when the docky have to link to tree .... => EditTools(item.id!.toString())
    const getToolsByType = (item: IPropertiesTable) => {
        let ret;
        switch (item.type) {
            case PropertyTreeType.Admin:
                ret = (<></>);
                break;
            case PropertyTreeType.AdminUser:
                ret = (<>EditTools(item.id!.toString())</>);
                break;
            case PropertyTreeType.AdminHomePage:
                ret = (<>EditTools(item.id!.toString())</>);
                break;
            case PropertyTreeType.AdminLibrary:
                ret = (<></>);
                break;
            case PropertyTreeType.AdminLibraryDocky:
                ret = (<>{AddTools(item.id as number, item.type)}{AddDivTools(item.id as number, item.type)}</>);
                break;
            case PropertyTreeType.AdminLibraryDockyDiv:
                ret = (<>{AddTools(item.id as number, item.type)}{AddDivTools(item.id as number, item.type)}</>);
                break;
            case PropertyTreeType.AdminDocky:
                ret = (<>EditTools(item.id!.toString())</>);
                break;
            case PropertyTreeType.AdminLibraryArticle:
                ret = (<>{AddTools(item.id as number, item.type)}{AddDivTools(item.id as number, item.type)}</>);
                break;
            case PropertyTreeType.AdminLibraryArticleDiv:
                ret = (<>{AddTools(item.id as number, item.type)}{AddDivTools(item.id as number, item.type)}</>);
                break;
            case PropertyTreeType.AdminArticle:
                ret = (<>EditTools(item.id!.toString())</>);
                break;
            case PropertyTreeType.Library:
                ret = (<></>);
                break;
            case PropertyTreeType.LibraryDocky:
                ret = (<>{AddTools(item.id as number, item.type)}{AddDivTools(item.id as number, item.type)}</>);
                break;
            case PropertyTreeType.LibraryDockyDiv:
                ret = (<>{AddTools(item.id as number, item.type)}{AddDivTools(item.id as number, item.type)}</>);
                break;
            case PropertyTreeType.Docky:
                ret = (<>EditTools(item.id!.toString())</>);
                break;
            case PropertyTreeType.LibraryArticle:
                ret = (<>{AddTools(item.id as number, item.type)}{AddDivTools(item.id as number, item.type)}</>);
                break;
            case PropertyTreeType.LibraryArticleDiv:
                ret = (<>{AddTools(item.id as number, item.type)}{AddDivTools(item.id as number, item.type)}</>);
                break;
            case PropertyTreeType.Article:
                ret = (<>EditTools(item.id!.toString())</>);
                break;
            case PropertyTreeType.Calendar:
                ret = (<></>);
                break;
            case PropertyTreeType.CalendarHistory:
                ret = (<></>);
                break;
            case PropertyTreeType.CalendarUpComming:
                ret = (<>{AddTools(item.id as number, item.type)}{AddDivTools(item.id as number, item.type)}</>);
                break;
            case PropertyTreeType.CalendarEvent:
                ret = (<>EditTools(item.id!.toString())</>);
                break;
            case PropertyTreeType.Events:
                ret = (<>{EditTools(item.id!.toString())}{AddTools(item.id as number, item.type)}{AddDivTools(item.id as number, item.type)}</>);
                break;
            case PropertyTreeType.EventsDiv:
                ret = (<>{AddTools(item.id as number, item.type)}{AddDivTools(item.id as number, item.type)}</>);
                break;
            case PropertyTreeType.Event:
                ret = (<>EditTools(item.id!.toString())</>);
                break;
            default:
                throw new Error('PropertyTreeType Type Unknown !!')
        }
        return ret;
    }

    return (

        <div id="sidebar-multi-level-sidebar" className="w-90 h-full border-2 border-black transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar" >
            <div className="h-full px-3 py-4 overflow-y-auto bg-amber-50 dark:bg-gray-800">
                {trees &&
                    <ul className="font-medium space-y-2"> {/* */}
                        {/* {trees?.map((item: IPropertiesTable, index: number) => {
                            return getMenuItem(item, index, 2)
                        } */}
                        {
                            buildMenu(trees, expendedId, setExpendedId, getToolsByType)
                        }
                    </ul >
                }
                {(trees.length === 0) &&
                    <div>
                        <div role="status">
                            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            {/* <span className="sr-only">Loading...</span> */}
                        </div>
                    </div>
                }
                {/* {(treesSwr.isError) &&
                    <div>
                        <div role="status">
                            <span className="sr-only">Error : {JSON.stringify(treesSwr.isError)}</span>
                        </div>
                    </div>
                } */}
            </div>
            <CreateModal {...modalProps} />
        </div >


    );
}
