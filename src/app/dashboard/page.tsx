"use client"
import AdminTree from '@/components/AdminTree/AdminTree';
import { useEffect, useState } from 'react';



export default function Dashboard() {
    const [treeData, setTreeData] = useState([]);

    useEffect(() => {
        (async function () {
            try {
                const data = await fetch(`/api/dashboard/tree`, {
                    method: "GET",
                })
                if (data.ok) {
                    const treeData = await data.json();
                    setTreeData(treeData);
                }
            } catch (err) {
                console.log(err);
            }
        })();
    }, [treeData])


    return (
        <div>
            <aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
                <AdminTree data={treeData} />{/*onClick={onPropertyClick}*/}
            </aside>

            <div className="p-4 sm:ml-64">
                <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">

                </div>
            </div>
        </div>
    );
}
