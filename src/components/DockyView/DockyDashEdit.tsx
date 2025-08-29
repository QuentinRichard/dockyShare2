'use client'

import { DockyFileData } from "@/db/schema/dockies";
import { dashContentEditToolbarbuilder, getContentEditNode } from "../DashContent/DockyContentTools";
import { ViewProps } from "./ViewProps";


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
