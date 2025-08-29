'use client'

import { DockyFileData } from "@/db/schema/dockies";
import { DashViewContentToolbarProps, getContentViewNode, ViewContentProps } from "../DashContent/DockyContentTools";


export function dockyViewToolbarBuilder(props: DashViewContentToolbarProps) {
    //TODO Nav mettre une action en position relatif afin de pouvoir passer en mode edite
    const clickDebug = () => {
        props.nav(props.slug)
    }
    return (
        <div className="border-b border-t border-gray-400 p-2 flex justify-center gap-2">
            <button className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-700" onClick={() => { clickDebug() }}>Editer</button>
        </div >
    );
}

export default function DockyDashView(props: ViewContentProps) {

    return (
        <div className="border-gray-400 border-2 h-full w-full shrink">

            <h1>
                <p>Name: {props.data.description} - slug: {props.data.slug}</p>
                <p>Description: {props.data.description}</p>
            </h1>
            {/* {props.toolbar && <props.toolbar slug={props.data.slug} ></props.toolbar>} */}
            <hr></hr>
            {(props.data.children as unknown as DockyFileData[])?.map((child: DockyFileData) =>
                getContentViewNode(child, props.height / (props.data?.children?.length ?? 0) + 1, props.width, dockyViewToolbarBuilder, props.nav)
            )}
        </div>
    );
}
