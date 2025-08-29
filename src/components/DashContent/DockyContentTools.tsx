import ArticleBoardDrawEdit from "@/components/DockyView/ArticleBoardDrawEdit";
import ArticleBoardDrawView from "@/components/DockyView/ArticleBoardDrawView";
import ArticleMdEdit from "@/components/DockyView/ArticleMdEdit";
import ArticleMdView from "@/components/DockyView/ArticleMdView";
import ArticlePlantUmlEdit from "@/components/DockyView/ArticlePlantUmlEdit";
import ArticlePlantUmlView from "@/components/DockyView/ArticlePlantUmlView";
import DockyDashView from "@/components/DockyView/DockyDashView";
import { DockyFileCatEnum, DockyFileData, DockyFileTypeEnum } from "@/db/schema/dockies";
import { ReactNode } from "react";



export const emptyMD = `
`;
export interface DashEditContentToolbarProps {
    onSave?: () => void
    onCancel?: () => void
}

export interface DashViewContentToolbarProps {
    slug: string
}

export type DashEditContentToolbarBuilder = (props: DashEditContentToolbarProps) => ReactNode
export type DashViewContentToolbarBuilder = (props: DashViewContentToolbarProps) => ReactNode

export function getContentEditNode(data: DockyFileData, height: number, width: number, toolsbarBuilder: DashEditContentToolbarBuilder): ReactNode {
    console.log("getContentEditNode data", data);
    if (!data) return (<div>Pas de données</div>);
    if (data.type === DockyFileTypeEnum.Docky) {
        return (<DockyDashView data={data} height={height} width={width} toolbar={toolsbarBuilder} />);
    } else {
        if (data.type === DockyFileTypeEnum.Article) {
            switch (data.cat! as DockyFileCatEnum) {
                case DockyFileCatEnum.Article_MD:
                    return (<ArticleMdEdit data={data} height={height} width={width} toolbar={toolsbarBuilder}></ArticleMdEdit>);
                case DockyFileCatEnum.Article_Graph:
                    return (<ArticlePlantUmlEdit data={data} height={height} width={width} toolbar={toolsbarBuilder}></ArticlePlantUmlEdit>);
                case DockyFileCatEnum.Article_Board:
                    return (<ArticleBoardDrawEdit data={data} height={height} width={width} toolbar={toolsbarBuilder}></ArticleBoardDrawEdit>);
                default:
                    return (<div>Cat pas encore dev {data.type}</div>);
            }
        }
    }
}
export function getContentViewNode(data: DockyFileData, height: number, width: number, toolsbarBuilder: DashViewContentToolbarBuilder): ReactNode {
    console.log("getContentEditNode data", data);
    if (!data) return (<div>Pas de données</div>);
    if (data.type === DockyFileTypeEnum.Docky) {
        return (<DockyDashView data={data} height={height} width={width} toolbar={toolsbarBuilder} />);
    } else {
        if (data.type === DockyFileTypeEnum.Article) {
            switch (data.cat! as DockyFileCatEnum) {
                case DockyFileCatEnum.Article_MD:
                    return (<ArticleMdView data={data} height={height} width={width} toolbar={toolsbarBuilder}></ArticleMdView>);
                case DockyFileCatEnum.Article_Graph:
                    return (<ArticlePlantUmlView data={data} height={height} width={width} toolbar={toolsbarBuilder}></ArticlePlantUmlView>);
                case DockyFileCatEnum.Article_Board:
                    return (<ArticleBoardDrawView data={data} height={height} width={width} toolbar={toolsbarBuilder}></ArticleBoardDrawView>);
                default:
                    return (<div>Cat pas encore dev {data.type}</div>);
            }
        }
    }
}