'use client'

import { DockyFileData } from "@/db/schema/dockies";
import { DashEditContentToolbarProps, getContentEditNode } from "../DashContent/DockyContentTools";
import { ViewProps } from "./ViewProps";


export function dashContentEditToolbarbuilder(props: DashEditContentToolbarProps) {
    return (
        <div className="border-b border-t border-gray-400 p-2 flex justify-center gap-2">
            {props.onCancel && <button className="bg-amber-200 text-white px-4 py-2 rounded hover:bg-red-600" onClick={props.onCancel}>Annuler</button>}
            {props.onSave && <button className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-700" onClick={props.onSave}>Sauvegarder</button>}
            Add other tool to Delete
        </div>
    );
}
export default function DockyDashEdit(props: ViewProps) {
    const onSave = async (content?: string) => {
        // const newData: UpdateDockyFileData = { ...props.data, data: { content, imgSrc: '' } };
        // await callDockiesPut(newData);
        console.log("On Server")
    }
    const onCancel = async () => {
        console.log("OnCancel")
    }

    return (
        <div className="border-gray-400 border-2 h-full w-full shrink">

            <h1>
                <p>Name: {props.data.description} - slug: {props.data.slug}</p>
                <p>Description: {props.data.description}</p>
            </h1>
            {props.toolbar && <props.toolbar onSave={async () => { await onSave() }} onCancel={async () => { onCancel() }}></props.toolbar>}
            Add other tool to Add Article or Create
            <hr></hr>
            {(props.data.children as unknown as DockyFileData[])?.map((child: DockyFileData) =>
                getContentEditNode(child, props.height / (props.data?.children?.length ?? 0) + 1, props.width, dashContentEditToolbarbuilder, props.nav)
            )}
        </div>
    );
}
