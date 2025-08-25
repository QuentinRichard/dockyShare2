"use client"
import DashContent from '@/components/DashContent/DashContent';
import DashMenu from '@/components/DashMenu/DashMenu';
import { useEffect, useState } from 'react';



export default function Dashboard() {
    const [treeData] = useState([]);

    useEffect(() => {
        // (async function () {
        //     try {
        //         const data = await fetch(`/api/dashboard/tree`, {
        //             method: "GET",
        //         })
        //         if (data.ok) {
        //             const treeData = await data.json();
        //             setTreeData(treeData);
        //         }
        //     } catch (err) {
        //         console.log(err);
        //     }
        // })();
    }, [treeData])


    return (
        <div className="w-full h-full flex align-top text-left border-gray-400 border-2">

            <DashMenu />


            {/* Barre de resize */}
            <div className="absolute top-0 right-0 w-1 h-full bg-gray-400 cursor-col-resize"
                onMouseDown={(e) => {
                    e.preventDefault();
                    // const move = (ev) => handleResize(ev);
                    // const up = () => {
                    //     window.removeEventListener("mousemove", move);
                    //     window.removeEventListener("mouseup", up);
                    // };
                    // window.addEventListener("mousemove", move);
                    // window.addEventListener("mouseup", up);
                }}>
            </div>

            <DashContent />

            {/* <aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
                <AdminTree data={treeData} />
            </aside>

            <div className="p-4 sm:ml-64">
                <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">

                </div>
            </div> */}
        </div>
    );
}
