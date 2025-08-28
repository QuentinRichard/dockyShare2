'use client'

import { useGetDockeySlug } from "@/app/lib/uses";
import ArticleMdEdit from "@/components/DockyView/ArticleMdEdit";
import { DockyFileCatEnum, DockyFileData, DockyFileTypeEnum } from "@/db/schema/dockies";
import ArticlePlantUmlEdit from "../DockyView/ArticlePlantUmlEdit";
import DockyView from "../DockyView/DockyView";

export interface DashContentProps {
    slug: string
}
export interface DashContentToolbarProps {
    onSave: () => void
    onCancel: () => void
}

export function DashContentToolbarProps(props: DashContentToolbarProps) {
    return (
        <div className="border-b border-t border-gray-400 p-2 flex justify-center gap-2">
            <button className="bg-amber-200 text-white px-4 py-2 rounded hover:bg-red-600" onClick={props.onCancel}>Annuler</button>
            <button className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-700" onClick={props.onSave}>Sauvegarder</button>
        </div>
    );
}

export default function DashContent(props: DashContentProps) {

    const { data, isError, isLoading } = useGetDockeySlug(props.slug);
    const getViewConfig = (data: DockyFileData) => {
        if (!data) return (<div>Pas de données</div>);
        if (data.type === DockyFileTypeEnum.Docky) {
            return (<DockyView data={data} />);
        } else {
            if (data.type === DockyFileTypeEnum.Article) {
                switch (data.cat! as DockyFileCatEnum) {
                    case DockyFileCatEnum.Article_MD:
                        return (<ArticleMdEdit data={data} toolbar={DashContentToolbarProps}></ArticleMdEdit>);
                    case DockyFileCatEnum.Article_Graph:
                        return (<ArticlePlantUmlEdit data={data} toolbar={DashContentToolbarProps}></ArticlePlantUmlEdit>);
                    default:
                        return (<div>Cat pas encore dev</div>);
                }
            }
        }
    }
    return (
        <div className="flex-1 h-full overflow-auto border-gray-400 border-2 h-full w-full shrink">
            {data && props.slug.length > 0 ? getViewConfig(data) : <div className="p-4">loading...</div>}
        </div>
    );
}
