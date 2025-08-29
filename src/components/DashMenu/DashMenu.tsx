import '@/../node_modules/react-simple-tree-menu/dist/main.css';
import { useDockyShareContext } from '@/app/dashboard/context';
import { NavigationAction } from '@/components/DashContent/DockyContentTools';
import CreateModal, { getModalType, ModalProps } from '@/components/Modal/CreateModal';
import { PropertyTreeType } from '@/db/schema/property';
import { useState } from 'react';
import { toast } from 'react-toastify';
import DockyMenu from './DockyMenu';


export interface DashMenuProps {
    navigation: (dockySlug: string, action: NavigationAction) => void
    activeSlug?: string
}


export default function DashMenu(props: DashMenuProps) {
    const [modalProps, setModalProps] = useState({} as ModalProps)
    const { fullTrees } = useDockyShareContext();

    const onEditAction = (slug: string) => {
        props!.navigation(slug, NavigationAction.EditAction);
    }
    const onViewAction = (slug: string) => {
        props!.navigation(slug, NavigationAction.ViewAction);
    }

    const onAddDivAction = (id: number, type: PropertyTreeType) => {
        setModalProps({
            action: onModalActionResult,
            open: true,
            type: 'Div',
            data: {
                fullTrees,
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
                fullTrees,
                id
            },
            title: 'Ajouter un élèment'
        });
    }
    const onModalActionResult = (state: boolean, msg: string | undefined) => {
        setModalProps({ ...modalProps, open: false });
        if (msg === undefined) return;
        if (state)
            toast.success(msg);
        else
            toast.error(msg);
    }
    return (
        <div
            id="sidebar-multi-level-sidebar"
            className="flex-1 h-full border-r border-black "
            aria-label="Sidebar"
        >
            {fullTrees && DockyMenu(fullTrees, { onEditAction, onAddDivAction, onAddAction, onViewAction }, props.activeSlug)}
            <CreateModal {...modalProps} />
        </div >


    );
}
