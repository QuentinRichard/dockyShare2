'use client'

import { useGetDockeyBySlug } from "@/app/lib/uses";
import { dashViewToolbarBuilder, getContentViewNode } from "./DockyContentTools";

export interface DashContentProps {
    slug: string
    height: number
    width: number
    navigation: (slug: string) => void
}



export default function DashContent(props: DashContentProps) {

    const { data, isError, isLoading } = useGetDockeyBySlug(props.slug);

    const nav = (slug: string) => {
        if (props.navigation) props.navigation(slug);
    }


    return (
        <div className="scroll-container p-4 bg-gray-100 h-full">
            {/* {data && props.slug.length > 0 ? getContentEditNode(data, props.height, props.width, dashContentEditToolbarbuilder) : <div className="p-4">loading...</div>} */}
            {data && props.slug.length > 0 ? getContentViewNode(data, props.height, props.width, dashViewToolbarBuilder, nav) : <div className="p-4">loading...</div>}
        </div>
    );
}
