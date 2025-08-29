'use client'

import { DockyFileData } from "@/db/schema/dockies";
import { dashViewToolbarBuilder, getContentViewNode, ViewContentProps } from "../DashContent/DockyContentTools";




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
                getContentViewNode(child, props.height / (props.data?.children?.length ?? 0) + 1, props.width, dashViewToolbarBuilder, props.nav)
            )}
        </div>
    );
}
