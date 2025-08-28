'use client'

import { DockyFileData } from "@/db/schema/dockies";

export interface DockyViewProps {
    data: DockyFileData
}


export default function DockyView(props: DockyViewProps) {

    return (
        <div className="border-gray-400 border-2 h-full w-full shrink">
            En Contruction...
        </div>
    );
}
