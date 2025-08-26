'use client'

import { PropertyTreeType } from "@/db/schema/property";
import { useRef } from "react";
import CreateArticleForm, { ArticleDataForm } from "../Forms/CreateArticle";
import CreateDivForm, { DivDataForm } from "../Forms/CreateDiv";
import CreateDockyForm, { DockyDataForm } from "../Forms/CreateDocky";
import CreateEventForm from "../Forms/CreateEvent";

export interface ModalProps {
    icon?: string
    title?: string
    type: 'Docky' | 'Article' | 'Div' | 'Event'
    open: boolean
    data?: unknown
    action: (data: boolean, msg: string) => void
}

export function getModalType(type: PropertyTreeType) {
    console.log(type);
    switch (type) {
        case PropertyTreeType.AdminLibraryDocky:
            return 'Docky';
            break;
        case PropertyTreeType.AdminLibraryDockyDiv:
            return 'Docky';
            break;
        case PropertyTreeType.AdminLibraryArticle:
            return 'Article';
            break;
        case PropertyTreeType.AdminLibraryArticleDiv:
            return 'Article';
            break;
        case PropertyTreeType.LibraryDocky:
            return 'Docky';
            break;
        case PropertyTreeType.LibraryDockyDiv:
            return 'Docky';
            break;
        case PropertyTreeType.LibraryArticle:
            return 'Article';
            break;
        case PropertyTreeType.LibraryArticleDiv:
            return 'Article';
            break;
        default:
            throw new Error('PropertyTreeType for Modal case Unknown !!')
    }
}

interface DialogInterface {
    open: () => void
    close: () => void
}

export default function CreateModal(props: ModalProps) {
    const modalDialogRef = useRef(null);
    // const onOpen = () => {

    //     if (modalDialogRef.current!.open)
    //         modalDialogRef.current!.close();
    //     else
    //         modalDialogRef.current!.showModal();
    // }

    const onAction = (result: boolean, msg: string) => {
        props.action(result, msg);

        if ((modalDialogRef.current! as DialogInterface).open)
            (modalDialogRef.current! as DialogInterface).close();
    }

    return (

        <dialog id="dialog" open={props.open} ref={modalDialogRef} aria-labelledby="dialog-title"
            className="fixed inset-0 size-auto  h-screen w-screen max-h-none max-w-none overflow-y-auto bg-amber-50/75 backdrop:bg-amber-50/75">
            {/* <el-dialog-backdrop className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></el-dialog-backdrop> */}

            <div tabIndex={0} className="flex flex-col min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0">
                {/* <el-dialog-panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"> */}
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                        {/* <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-slot="icon" aria-hidden="true" className="size-6 text-red-600">
                                    <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div> */}
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            {props.type === 'Docky' && <CreateDockyForm action={onAction} data={props.data as DockyDataForm} />}
                            {props.type === 'Article' && <CreateArticleForm action={onAction} data={props.data as ArticleDataForm} />}
                            {props.type === 'Div' && <CreateDivForm action={onAction} data={props.data as DivDataForm} />}
                            {props.type === 'Event' && <CreateEventForm action={onAction} />}
                        </div>
                    </div>
                </div>
                {/* <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button type="button" command="close" commandfor="dialog" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto" 
                        onClick={()=>{if(props.action)props.action()}}>Deactivate</button>
                        <button type="button" command="close" commandfor="dialog" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" 
                        onClick={()=>modalDialogRef.current!.close()}>Cancel</button>
                    </div> */}
                {/* </el-dialog-panel> */}
            </div>
        </dialog>
    )
}