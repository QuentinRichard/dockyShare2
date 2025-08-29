"use client"
import { DockyFileData } from "@/db/schema/dockies";
import { IPropertiesTable } from "@/db/schema/property";
import { Rules } from "@/db/schema/rules";
import { createContext, useContext } from "react";


export interface DockyContext {
    userRules: Rules,
    setUserRules: (rules: Rules) => void,
    trees: IPropertiesTable[],
    setTrees: (tab: IPropertiesTable[]) => void,
    fullTrees: IPropertiesTable[],
    setFullTrees: (tab: IPropertiesTable[]) => void,
    dockies: DockyFileData[],
    setDockies: (tab: DockyFileData[]) => void,
    articles: DockyFileData[]
    setArticles: (tab: DockyFileData[]) => void
}

export const defaultContext: DockyContext = {
    userRules: {
        name: '',
        permissions: {
            management: { AcceuilPageMng: false, userMng: false },
            homePage: { create: false, delete: false, edit: false, share: false },
            docky: { create: false, delete: false, edit: false, share: false },
            calendar: { create: false, delete: false, edit: false, share: false },
            event: { create: false, delete: false, edit: false, share: false },
            sharing: { create: false, delete: false, edit: false, share: false },
        },
    },
    setUserRules: () => { },
    trees: [],
    setTrees: () => { },
    fullTrees: [],
    setFullTrees: () => { },
    dockies: [],
    setDockies: () => { },
    articles: [],
    setArticles: () => { }
}

export const DockyShareContext = createContext<DockyContext>(defaultContext);

export const useDockyShareContext = () => useContext(DockyShareContext);