'use client'

import { useGetDockeyBySlug } from "@/app/lib/uses";
import { dashContentEditToolbarbuilder, dashViewToolbarBuilder, DockyNavigation, getContentEditNode, getContentViewNode, NavigationAction } from "./DockyContentTools";

export interface DashContentProps {
    slug: string
    height: number
    width: number
    navigation: DockyNavigation
    action: NavigationAction
}



export default function DashContent(props: DashContentProps) {

    const { data } = useGetDockeyBySlug(props.slug);

    const nav = (slug: string, action: NavigationAction) => {
        if (props.navigation) props.navigation(slug, action);
    }


    return (
        <div className="scroll-container p-4 bg-gray-100 h-full">
            {props.action === NavigationAction.EditAction && data && props.slug.length > 0 ? getContentEditNode(data, props.height, props.width, dashContentEditToolbarbuilder) : <div className="p-4">loading...</div>}
            {props.action === NavigationAction.ViewAction && data && props.slug.length > 0 ? getContentViewNode(data, props.height, props.width, dashViewToolbarBuilder, nav) : <div className="p-4">loading...</div>}
        </div>
    );
}
