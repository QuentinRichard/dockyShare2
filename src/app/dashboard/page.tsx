"use client"
import { useEffect, useRef, useState } from 'react';
// import { ToastContainer } from 'react-toastify';
import { useTrees } from '@/app/lib/uses';
import DashContent from '@/components/DashContent/DashContent';
import DashMenu from '@/components/DashMenu/DashMenu';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDockyShareContext } from './context';

export default function Dashboard() {
    const [slugNavigation, setSlugNavigation] = useState("");
    const [isSet, setIsSet] = useState(false);
    const { setTrees } = useDockyShareContext();
    const treesSwr = useTrees();

    // Largeur du menu redimensionnable
    const minWidth = 200;
    const [menuWidth, setMenuWidth] = useState(minWidth);
    const [isResizing, setIsResizing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isResizing) return;

        const handleMouseMove = (e: MouseEvent) => {
            // On calcule la position relative au conteneur parent
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left;
                setMenuWidth(Math.max(180, Math.min(x, rect.width)));
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
        <div ref={containerRef} className="flex-1 flex flex-row h-full w-full" id='dashboard'>
            {/* Menu à gauche + poignée */}
            <div
                className="h-full bg-white dark:bg-gray-900 border-r border-gray-400 transition-all duration-100 relative"
                style={{ width: menuWidth, minWidth: minWidth, maxWidth: 800 }}
            >

                <DashMenu navigation={onMenuNavigate} />
                {/* Poignée de redimensionnement */}
                <div
                    className="absolute top-0 right-0 h-full w-2 flex items-center justify-center cursor-col-resize select-none z-20"
                    onMouseDown={() => setIsResizing(true)}
                    role="separator"
                    aria-orientation="vertical"
                    tabIndex={0}
                >
                    <div className="w-1 h-16 bg-gray-400 rounded-full" />
                </div>
            </div>

            {/* Contenu à droite */}
            <div className="flex-1 h-full overflow-auto bg-gray-50 dark:bg-gray-800">
                <DashContent slug={slugNavigation} />
            </div>

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