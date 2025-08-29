

import { callDockiesPut } from '@/app/lib/uses';
import { emptyMD } from '@/components/DashContent/DockyContentTools';
import { UpdateDockyFileData } from '@/db/schema/dockies';
import { useEffect, useRef, useState } from 'react';
import { ViewProps } from './ViewProps';

// import plantumlEncoder from 'plantuml-encoder';
/* eslint-disable @typescript-eslint/no-require-imports */
const plantumlEncoder = require('plantuml-encoder')



export default function ArticlePlantUmlEdit(props: ViewProps) {
    const [plantUmlSrc, setPlantUmlSrc] = useState(props.data!.data['content'] || emptyMD);
    const [encoded, setEncoded] = useState(props.data!.data['encoded'] || emptyMD);
    const [imgSrc, setImgSrc] = useState(props.data!.data['imgSrc'] || emptyMD);
    const [key, setKey] = useState(Date.now());
    const imageSrcRef = useRef<HTMLImageElement>(null);

    const debounceRef = useRef<NodeJS.Timeout | null>(null);


    // Largeur du menu redimensionnable
    const minWidth = 200;
    const [menuWidth, setMenuWidth] = useState(minWidth);
    const [isResizing, setIsResizing] = useState(false);
    const containerPlantUmlRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isResizing) return;

        const handleMouseMove = (e: MouseEvent) => {
            // On calcule la position relative au conteneur parent
            if (containerPlantUmlRef.current) {
                const rect = containerPlantUmlRef.current.getBoundingClientRect();
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
    function blobToBase64(blob: Blob) {
        return new Promise((resolve, _) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }
    const onContentChange = async (md: string) => {
        if (md.length === 0) md = emptyMD;

        setPlantUmlSrc(md);

        // Debounce pour éviter les appels trop fréquents
        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(async () => {
            const encoded = plantumlEncoder.encode(md);
            const blob = await fetch(`http://www.plantuml.com/plantuml/img/${encoded}`)
                .then(res => { return res.blob() })

            const base64 = await blobToBase64(blob) as string;
            //imageSrcRef.current!.setAttribute('src', URL.createObjectURL(blob));
            console.log('base64', base64);
            setEncoded(encoded);
            setImgSrc(base64);
            setKey(Date.now());
        }, 800); // 600ms après la dernière frappe
    }

    const onSave = async () => {
        const newData: UpdateDockyFileData = { ...props.data, data: { content: plantUmlSrc, encoded, imgSrc } };
        await callDockiesPut(newData);
    }

    const onCancel = () => {
        setPlantUmlSrc(props.data!.data['content'] || emptyMD);
        setEncoded(props.data!.data['encoded'] || emptyMD);
        setImgSrc(props.data!.data['imgSrc'] || emptyMD);
        setKey(Date.now());
        console.log("Cancel");

    }
    return (
        <div className="border-gray-400 border-2 w-full flex-1  shrink p-4 overflow-auto">
            {/* style={{ height: props.height, width: props.width }} */}
            <div ref={containerPlantUmlRef} className="w-full  flex flex-row relative" >
                {/* Menu à gauche + poignée */}
                <div
                    className=" bg-white dark:bg-gray-900 border-r border-gray-400 transition-all duration-100 relative"
                    style={{ width: menuWidth, minWidth: minWidth, maxWidth: 800 }}
                >
                    <textarea
                        className="w-full h-full p-4 border-0 resize-none focus:ring-0 focus:outline-none"
                        value={plantUmlSrc}
                        onChange={(e) => {
                            onContentChange(e.target.value);
                        }}
                        rows={5}
                        cols={33}
                    >{plantUmlSrc}</textarea>

                    {/* Poignée de redimensionnement */}
                    <div
                        className="absolute top-0 right-0 w-2 flex items-center justify-center cursor-col-resize select-none z-20"
                        onMouseDown={() => setIsResizing(true)}
                        role="separator"
                        aria-orientation="vertical"
                        tabIndex={0}
                    >
                        <div className="w-1 h-16 bg-gray-400 rounded-full" />
                    </div>
                </div>

                {/* Contenu à droite */}
                <div className="overflow-auto dark:bg-gray-800 justify-center">
                    <img key={key} ref={imageSrcRef} src={imgSrc} />
                    {/* src={`http://www.plantuml.com/plantuml/img/${encoded}`} */}
                </div>

            </div>
            {props.toolbar && <props.toolbar onSave={async () => { await onSave() }} onCancel={async () => { onCancel() }}></props.toolbar>}

        </div >
    )
}