"use client"
import "@/app/globals.css";
import { DockyFileData } from "@/db/schema/dockies";
import { IPropertiesTable } from "@/db/schema/property";
import { Rules } from "@/db/schema/rules";
import { useState } from "react";
import { DockyContext, DockyShareContext } from "./context";


const defaultUserRules: Rules = {
    name: '',
    permissions: {
        management: { AcceuilPageMng: false, userMng: false },
        homePage: { create: false, delete: false, edit: false, share: false },
        docky: { create: false, delete: false, edit: false, share: false },
        calendar: { create: false, delete: false, edit: false, share: false },
        event: { create: false, delete: false, edit: false, share: false },
        sharing: { create: false, delete: false, edit: false, share: false },
    }
}

export default function DashbordLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [userRules, setUserRules] = useState<Rules>(defaultUserRules);
    const [trees, setTrees] = useState<IPropertiesTable[]>([]);
    const [fullTrees, setFullTrees] = useState<IPropertiesTable[]>([]);
    const [dockies, setDockies] = useState<DockyFileData[]>([]);
    const [articles, setArticles] = useState<DockyFileData[]>([]);

    const dockyShareContext: DockyContext = {
        userRules, setUserRules,
        trees, setTrees,
        fullTrees, setFullTrees,
        dockies, setDockies,
        articles, setArticles
    }

    return (
        <DockyShareContext.Provider value={dockyShareContext}>
            <div className="main-content flex">
                {children}
            </div>
        </DockyShareContext.Provider>
    );
}
