import { DockyFileData } from "@/db/schema/dockies";


export interface ViewProps {
    data: DockyFileData
    /* eslint-disable @typescript-eslint/no-explicit-any */
    toolbar?: React.ComponentType<any>
    children?: React.ReactNode


    height: number
    width: number
}
