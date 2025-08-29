'use client'

import { useGetDockeyBySlug } from "@/app/lib/uses";
import ArticleMdEdit from "@/components/DockyView/ArticleMdEdit";
import { DockyFileCatEnum, DockyFileData, DockyFileTypeEnum } from "@/db/schema/dockies";
import ArticleBoardDrawEdit from "../DockyView/ArticleBoardDrawEdit";
import ArticlePlantUmlEdit from "../DockyView/ArticlePlantUmlEdit";
import DockyView from "../DockyView/DockyView";
import { getContentViewNode } from "./DockyContentTools";

export interface DashContentProps {
    slug: string
    height: number
    width: number
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

    const { data, isError, isLoading } = useGetDockeyBySlug(props.slug);
    const getViewConfig = (data: DockyFileData) => {
        if (!data) return (<div>Pas de données</div>);
        if (data.type === DockyFileTypeEnum.Docky) {
            return (<DockyView data={data} />);
        } else {
            if (data.type === DockyFileTypeEnum.Article) {
                switch (data.cat! as DockyFileCatEnum) {
                    case DockyFileCatEnum.Article_MD:
                        return (<ArticleMdEdit data={data} height={props.height} width={props.width} toolbar={DashContentToolbarProps}></ArticleMdEdit>);
                    case DockyFileCatEnum.Article_Graph:
                        return (<ArticlePlantUmlEdit data={data} height={props.height} width={props.width} toolbar={DashContentToolbarProps}></ArticlePlantUmlEdit>);
                    case DockyFileCatEnum.Article_Board:
                        return (<ArticleBoardDrawEdit data={data} height={props.height} width={props.width} toolbar={DashContentToolbarProps}></ArticleBoardDrawEdit>);
                    default:
                        return (<div>Cat pas encore dev {data.type}</div>);
                }
            }
        }
    }
    return (
        <div className="h-full flex flex-col  border-gray-400 shrink">
            <div className="flex-1 h-full">
                {/* {data && props.slug.length > 0 ? getViewConfig(data) : <div className="p-4">loading...</div>} */}

                {data && props.slug.length > 0 ? getContentViewNode(data, props.height, props.width, DashContentToolbarProps) : <div className="p-4">loading...</div>}
            </div>
        </div>
    );
}
