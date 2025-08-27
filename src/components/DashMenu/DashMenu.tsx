import '@/../node_modules/react-simple-tree-menu/dist/main.css';
import { useDockyShareContext } from '@/app/dashboard/context';
import { PropertyTreeType } from '@/db/schema/property';
import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateModal, { getModalType, ModalProps } from '../Modal/CreateModal';
import DockyMenu from './DockyMenu';


export interface DashMenuProps {
    navigation: (dockySlug: string) => void
}


export default function DashMenu(props: DashMenuProps) {
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


    return (
        <div
            id="sidebar-multi-level-sidebar"
            className="h-full border-r border-black transition-all"
            aria-label="Sidebar"
        >
            {DockyMenu(onEditAction, onAddDivAction, onAddAction, trees)}
            <CreateModal {...modalProps} />
        </div >


    );
}
