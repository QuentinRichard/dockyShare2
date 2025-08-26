"use client"
import DashContent from '@/components/DashContent/DashContent';
import DashMenu from '@/components/DashMenu/DashMenu';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { useTrees } from '../lib/uses';
import { useDockyShareContext } from './context';



export default function Dashboard() {
    const [slugNavigation, setSlugNavigation] = useState("");
    const [isSet, setIsSet] = useState(false);
    const { setTrees } = useDockyShareContext();
    const treesSwr = useTrees();
    if (treesSwr.data && treesSwr.data.length > 0 && !isSet) {
        setTimeout(() => {
            setIsSet(true);
            setTrees(treesSwr.data)
        }, 0)

    }


    const onMenuNavigate = (slug: string) => {
        setSlugNavigation(slug);
    }

    return (
        <div className="w-full h-full flex align-top text-left border-gray-400 border-2" id='dashboard'>

            <DashMenu navigation={onMenuNavigate} />


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

            <DashContent slug={slugNavigation} />


            <ToastContainer position="bottom-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
            />
        </div>
    );
}
