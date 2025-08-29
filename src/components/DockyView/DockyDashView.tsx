'use client'

import { DockyFileData } from "@/db/schema/dockies";
import Link from "next/link";
import { DashViewContentToolbarProps, getContentViewNode } from "../DashContent/DockyContentTools";
import { ViewProps } from "./ViewProps";


export function dockyViewToolbarBuilder(props: DashViewContentToolbarProps) {
    //TODO Nav mettre une action en position relatif afin de pouvoir passer en mode edite
    return (
        <div className="border-b border-t border-gray-400 p-2 flex justify-center gap-2">
            <Link className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-700" href={`/dashboard/edit/${props.slug}`}>Editer</Link>
        </div>
    );
}

export default function DockyDashView(props: ViewProps) {

    return (
        <div className="border-gray-400 border-2 h-full w-full shrink">

            <h1>
                <p>Name: {props.data.description} - slug: {props.data.slug}</p>
                <p>Description: {props.data.description}</p>
            </h1>
            {/* onSave={async () => { await onSave() }} onCancel={async () => { onCancel() }} */}
            {props.toolbar && <props.toolbar slug={props.data.slug} ></props.toolbar>}
            <hr></hr>
            {(props.data.children as unknown as DockyFileData[])?.map((child: DockyFileData) =>
                getContentViewNode(child, props.height / (props.data?.children?.length ?? 0) + 1, props.width, dockyViewToolbarBuilder)
            )}
        </div>
    );
}
