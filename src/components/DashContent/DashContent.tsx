'use client'

import { useGetDockeyBySlug } from "@/app/lib/uses";
import ArticlePlantUmlEdit from "@/components//DockyView/ArticlePlantUmlEdit";
import ArticleBoardDrawEdit from "@/components/DockyView/ArticleBoardDrawEdit";
import ArticleMdEdit from "@/components/DockyView/ArticleMdEdit";
import DockyDashView from "@/components/DockyView/DockyDashView";
import { DockyFileCatEnum, DockyFileData, DockyFileTypeEnum } from "@/db/schema/dockies";
import { DashEditContentToolbarProps, getContentEditNode } from "./DockyContentTools";

export interface DashContentProps {
    slug: string
    height: number
    width: number
    navigation: (slug: string) => void
}


export function dashContentEditToolbarbuilder(props: DashEditContentToolbarProps) {
    return (
        <div className="border-b border-t border-gray-400 p-2 flex justify-center gap-2">
            {props.onCancel && <button className="bg-amber-200 text-white px-4 py-2 rounded hover:bg-red-600" onClick={props.onCancel}>Annuler</button>}
            {props.onSave && <button className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-700" onClick={props.onSave}>Sauvegarder</button>}
            Add Delete Button
        </div>
    );
}

export default function DashContent(props: DashContentProps) {

    const { data, isError, isLoading } = useGetDockeyBySlug(props.slug);
    const getViewConfig = (data: DockyFileData) => {
        if (!data) return (<div>Pas de données</div>);
        if (data.type === DockyFileTypeEnum.Docky) {
            return (<DockyDashView data={data} height={props.height} width={props.width} nav={props.navigation} />);
        } else {
            if (data.type === DockyFileTypeEnum.Article) {
                switch (data.cat! as DockyFileCatEnum) {
                    case DockyFileCatEnum.Article_MD:
                        return (<ArticleMdEdit data={data} height={props.height} width={props.width} toolbar={dashContentEditToolbarbuilder}></ArticleMdEdit>);
                    case DockyFileCatEnum.Article_Graph:
                        return (<ArticlePlantUmlEdit data={data} height={props.height} width={props.width} toolbar={dashContentEditToolbarbuilder}></ArticlePlantUmlEdit>);
                    case DockyFileCatEnum.Article_Board:
                        return (<ArticleBoardDrawEdit data={data} height={props.height} width={props.width} toolbar={dashContentEditToolbarbuilder}></ArticleBoardDrawEdit>);
                    default:
                        return (<div>Cat pas encore dev {data.type}</div>);
                }
            }
        }
    }
    return (
        <div className="h-full flex flex-col  border-gray-400 shrink">
            <div className="flex-1 h-full min-h-0">
                {/* {data && props.slug.length > 0 ? getViewConfig(data) : <div className="p-4">loading...</div>} */}

                {data && props.slug.length > 0 ? getContentEditNode(data, props.height, props.width, dashContentEditToolbarbuilder) : <div className="p-4">loading...</div>}
            </div>
        </div>
    );
}
