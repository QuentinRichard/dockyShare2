import ArticleBoardDrawEdit from "@/components/DockyView/ArticleBoardDrawEdit";
import ArticleBoardDrawView from "@/components/DockyView/ArticleBoardDrawView";
import ArticleMdEdit from "@/components/DockyView/ArticleMdEdit";
import ArticleMdView from "@/components/DockyView/ArticleMdView";
import ArticlePlantUmlEdit from "@/components/DockyView/ArticlePlantUmlEdit";
import ArticlePlantUmlView from "@/components/DockyView/ArticlePlantUmlView";
import DockyDashView from "@/components/DockyView/DockyDashView";
import { DockyFileCatEnum, DockyFileData, DockyFileTypeEnum } from "@/db/schema/dockies";
import { ReactNode } from "react";
import DockyDashEdit from "../DockyView/DockyDashEdit";
import { ViewProps } from "../DockyView/ViewProps";


export function blobToBase64(blob: Blob) {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

export enum NavigationAction {
    EditAction = 'EditAction',
    ViewAction = 'ViewAction'
}

export type DockyNavigation = (slug: string, action: NavigationAction) => void

export const emptyMD = `
`;

export interface ViewContentProps extends ViewProps {
    nav: DockyNavigation
}

export interface DashEditContentToolbarProps {
    onSave?: () => void
    onCancel?: () => void
}

export type DashEditContentToolbarBuilder = (props: DashEditContentToolbarProps) => ReactNode

export function dashContentEditToolbarbuilder(props: DashEditContentToolbarProps) {
    return (
        <div className="border-b border-t border-gray-400 p-2 flex justify-center gap-2">
            {props.onCancel && <button className="bg-amber-200 text-white px-4 py-2 rounded hover:bg-red-600" onClick={props.onCancel}>Annuler</button>}
            {props.onSave && <button className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-700" onClick={props.onSave}>Sauvegarder</button>}
            Add Delete Button
        </div>
    );
}

export function getContentEditNode(data: DockyFileData, height: number, width: number, toolsbarBuilder: DashEditContentToolbarBuilder): ReactNode {
    if (!data) return (<div>Pas de données</div>);
    if (data.type === DockyFileTypeEnum.Docky) {
        return (<DockyDashEdit data={data} height={height} width={width} toolbar={toolsbarBuilder} />);
    } else {
        if (data.type === DockyFileTypeEnum.Article) {
            switch (data.cat! as DockyFileCatEnum) {
                case DockyFileCatEnum.Article_MD:
                    return (<ArticleMdEdit key={`amde_${data.slug}`} data={data} height={height} width={width} toolbar={toolsbarBuilder}></ArticleMdEdit>);
                case DockyFileCatEnum.Article_Graph:
                    return (<ArticlePlantUmlEdit key={`apue_${data.slug}`} data={data} height={height} width={width} toolbar={toolsbarBuilder}></ArticlePlantUmlEdit>);
                case DockyFileCatEnum.Article_Board:
                    return (<ArticleBoardDrawEdit key={`abde_${data.slug}`} data={data} height={height} width={width} toolbar={toolsbarBuilder}></ArticleBoardDrawEdit>);
                default:
                    return (<div>Cat pas encore dev {data.type}</div>);
            }
        }
    }
}


export interface DashViewContentToolbarProps {
    slug: string
    nav: DockyNavigation
}
export type DashViewContentToolbarBuilder = (props: DashViewContentToolbarProps) => ReactNode

export function dashViewToolbarBuilder(props: DashViewContentToolbarProps) {
    //TODO Nav mettre une action en position relatif afin de pouvoir passer en mode edite
    const clickDebug = () => {
        props.nav(props.slug, NavigationAction.EditAction)
    }
    return (
        <div className="border-b border-t border-gray-400 p-2 flex justify-center gap-2">
            <button className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-700" onClick={() => { clickDebug() }}>Editer</button>
        </div >
    );
}

export function getContentViewNode(data: DockyFileData, height: number, width: number, toolsbarBuilder: DashViewContentToolbarBuilder, nav: DockyNavigation): ReactNode {
    if (!data) return (<div>Pas de données</div>);
    if (data.type === DockyFileTypeEnum.Docky) {
        return (<DockyDashView data={data} height={height} width={width} toolbar={toolsbarBuilder} nav={nav} />);
    } else {
        if (data.type === DockyFileTypeEnum.Article) {
            switch (data.cat! as DockyFileCatEnum) {
                case DockyFileCatEnum.Article_MD:
                    return (<ArticleMdView key={`amdv_${data.slug}`} data={data} height={height} width={width} toolbar={toolsbarBuilder} nav={nav}></ArticleMdView>);
                case DockyFileCatEnum.Article_Graph:
                    return (<ArticlePlantUmlView key={`apuv_${data.slug}`} data={data} height={height} width={width} toolbar={toolsbarBuilder} nav={nav}></ArticlePlantUmlView>);
                case DockyFileCatEnum.Article_Board:
                    return (<ArticleBoardDrawView key={`adbv_${data.slug}`} data={data} height={height} width={width} toolbar={toolsbarBuilder} nav={nav}></ArticleBoardDrawView>);
                default:
                    return (<div>Cat pas encore dev {data.type}</div>);
            }
        }
    }
}