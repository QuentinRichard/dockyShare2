import { DockyFileData } from "@/db/schema/dockies";


export interface ViewProps {
    data: DockyFileData
    toolbar?: React.ComponentType<any>
    children?: React.ReactNode
}
