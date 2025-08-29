import { DockyFileCatEnum, DockyFileData, DockyFileTypeEnum } from "@/db/schema/dockies";
import { ReactNode } from "react";
import ArticleBoardDrawEdit from "../DockyView/ArticleBoardDrawEdit";
import ArticleMdEdit from "../DockyView/ArticleMdEdit";
import ArticlePlantUmlEdit from "../DockyView/ArticlePlantUmlEdit";
import DockyView from "../DockyView/DockyView";
import { DashContentToolbarProps } from "./DashContent";


export type DashContentToolbarBuilder = (props: DashContentToolbarProps) => ReactNode

export function getContentViewNode(data: DockyFileData, height: number, width: number, toolsbarBuilder: DashContentToolbarBuilder): ReactNode {
    if (!data) return (<div>Pas de données</div>);
    if (data.type === DockyFileTypeEnum.Docky) {
        return (<DockyView data={data} />);
    } else {
        if (data.type === DockyFileTypeEnum.Article) {
            switch (data.cat! as DockyFileCatEnum) {
                case DockyFileCatEnum.Article_MD:
                    return (<ArticleMdEdit data={data} height={height} width={width} toolbar={DashContentToolbarProps}></ArticleMdEdit>);
                case DockyFileCatEnum.Article_Graph:
                    return (<ArticlePlantUmlEdit data={data} height={height} width={width} toolbar={DashContentToolbarProps}></ArticlePlantUmlEdit>);
                case DockyFileCatEnum.Article_Board:
                    return (<ArticleBoardDrawEdit data={data} height={height} width={width} toolbar={DashContentToolbarProps}></ArticleBoardDrawEdit>);
                default:
                    return (<div>Cat pas encore dev {data.type}</div>);
            }
        }
    }
}