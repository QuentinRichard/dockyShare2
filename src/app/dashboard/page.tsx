"use client"
import { useEffect, useRef, useState } from 'react';
// import { ToastContainer } from 'react-toastify';
import { useTrees } from '@/app/lib/uses';
import DashContent from '@/components/DashContent/DashContent';
import DashMenu from '@/components/DashMenu/DashMenu';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDockyShareContext } from './context';

export default function Dashboard(props?: { slug?: string }) {
    const [slugNavigation, setSlugNavigation] = useState(props?.slug ?? "");
    const [isSet, setIsSet] = useState(false);
    const { setTrees } = useDockyShareContext();
    const treesSwr = useTrees();


    console.log('==> slugNavigation', slugNavigation)
    console.log('==> window.location', window.location)

    // Largeur du menu redimensionnable
    const minWidth = 200;
    const minHeight = 750;
    const [menuWidth, setMenuWidth] = useState(minWidth);
    const [contentWidth, setContentWidth] = useState(minWidth);
    const [contentHeight, setContentHeight] = useState(minHeight);
    const [isResizing, setIsResizing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isResizing) return;

        const handleMouseMove = (e: MouseEvent) => {
            // On calcule la position relative au conteneur parent
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const width = Math.max(180, Math.min(x, rect.width))
                setMenuWidth(width);
                setContentWidth(rect.width - width - 2)
                setContentHeight(rect.height)
                console.log("#######", contentWidth, contentHeight)
            }
        };
        const handleMouseUp = () => {
            setIsResizing(false);
            document.body.style.cursor = "";
            document.body.classList.remove("select-none");
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "col-resize";
        document.body.classList.add("select-none");

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            document.body.style.cursor = "";
            document.body.classList.remove("select-none");
        };
    }, [isResizing]);

    if (treesSwr.data && treesSwr.data.length > 0 && !isSet) {
        setTimeout(() => {
            setIsSet(true);
            setTrees(treesSwr.data)
        }, 0)
    }

    const onMenuNavigate = (slug: string) => {
        if (slug.length > 0)
            setSlugNavigation(slug);
    }

    return (
        <div ref={containerRef} className="flex-1 flex flex-row h-full w-full bg-red-200 min-h-0" id='dashboard'>
            {/* Menu à gauche + poignée */}
            <div
                className="h-full bg-white dark:bg-gray-900 border-r border-gray-400 relative"
                style={{ width: menuWidth, minWidth: minWidth, maxWidth: 800 }}
            >

                <DashMenu navigation={onMenuNavigate} activeSlug={slugNavigation} />
                {/* Poignée de redimensionnement */}
                {/* <div
                    className="h-full w-2 flex items-center justify-center cursor-col-resize select-none z-20"
                    onMouseDown={() => setIsResizing(true)}
                    role="separator"
                    aria-orientation="vertical"
                    tabIndex={0}
                >
                    <div className="w-1 h-16 bg-gray-400 rounded-full" />
                </div> */}
            </div>
            <div
                className="w-2 cursor-col-resize bg-gray-200 hover:bg-emerald-400 z-10 flex items-center"
                onMouseDown={() => setIsResizing(true)}
                style={{ userSelect: 'none' }}
            >
                <div className="w-1 h-16 bg-gray-400 rounded-full mx-auto" />
            </div>

            {/* Contenu à droite */}
            <div id="right-panel" className="flex-1 min-w-[100px] h-full">
                <DashContent slug={slugNavigation} navigation={onMenuNavigate} height={contentHeight} width={contentWidth} />
            </div>

            <ToastContainer position="bottom-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
            />
        </div >
    );
}