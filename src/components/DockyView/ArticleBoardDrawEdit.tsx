

import { callDockiesPut } from '@/app/lib/uses';
import { UpdateDockyFileData } from '@/db/schema/dockies';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TLEditorSnapshot, TLImageExportOptions, TLUserPreferences, Tldraw, getSnapshot, loadSnapshot, useEditor, useTldrawUser } from 'tldraw';
import 'tldraw/tldraw.css';
import { ViewProps } from './ViewProps';

import { blobToBase64 } from '../DashContent/DockyContentTools';
import _jsonSnapshot from './boardDrawInit.json';

/* @typescript-eslint/no-explicit-any */
const jsonSnapshot = _jsonSnapshot as unknown as TLEditorSnapshot

interface BoradDrawSnaphot {
    session: TLEditorSnapshot
    imgSrc: string | unknown
}

function SnapshotToolbar(props: { onSave: (obj: BoradDrawSnaphot) => void, content: BoradDrawSnaphot }) {
    const editor = useEditor()
    const [snapshot] = useState(props.content ? props.content : { session: jsonSnapshot })
    const [opts, setOpts] = useState<TLImageExportOptions>({
        scale: 1,
        background: false,
        padding: editor.options.defaultSvgPadding,
    })

    //const [box, setBox] = useState({ x: 0, y: 0, w: 0, h: 0 })

    const save = useCallback(async () => {
        const { document, session } = getSnapshot(editor.store)
        const shapeIds = editor.getCurrentPageShapeIds()
        if (shapeIds.size === 0) return alert('No shapes on the canvas')

        const { blob } = await editor.toImage([...shapeIds], {
            format: 'png',
            ...opts,
            // If we have numbers for all of the box values, we can use them as bounds
            // bounds: Object.values(box).every((b) => !Number.isNaN(b))
            //     ? new Box(box.x, box.y, box.w, box.h)
            //     : undefined,
        })
        const imgSrc = await blobToBase64(blob);
        console.log('document', imgSrc)
        if (props.onSave) props.onSave({ session: { document, session }, imgSrc })
    }, [editor])

    const load = useCallback(() => {
        loadSnapshot(editor.store, snapshot.session)
    }, [editor])

    const [showCheckMark, setShowCheckMark] = useState(false)
    useEffect(() => {
        if (editor && snapshot)
            loadSnapshot(editor.store, snapshot.session);

        if (showCheckMark) {
            const timeout = setTimeout(() => {
                setShowCheckMark(false)
            }, 1000)
            return () => clearTimeout(timeout)
        }
        return
    })

    return (
        <div style={{ padding: 20, pointerEvents: 'all', display: 'flex', gap: '10px' }}>
            <span
                style={{
                    display: 'inline-block',
                    transition: 'transform 0.2s ease, opacity 0.2s ease',
                    transform: showCheckMark ? `scale(1)` : `scale(0.5)`,
                    opacity: showCheckMark ? 1 : 0,
                }}
            >
                Saved ✅
            </span>
            <button
                onClick={() => {
                    save()
                    setShowCheckMark(true)
                }}
            >
                Save Snapshot
            </button>
            <button onClick={load}>Load Snapshot</button>
        </div>
    )
}


export default function ArticleBoardDrawEdit(props: ViewProps) {
    const [snapshot] = useState(props.data!.data['content'] || { session: jsonSnapshot, imgSrc: '' })
    const [height, setHeight] = useState(0)
    const [width, setWidth] = useState(0)
    const tlDrawRef = useRef<HTMLDivElement>(null);

    const [userPreferences, setUserPreferences] = useState<TLUserPreferences>({
        id: props.data.slug,
        isDynamicSizeMode: true,
    })
    const user = useTldrawUser({ userPreferences, setUserPreferences })

    useEffect(() => {
        const rect = tlDrawRef.current!.getBoundingClientRect();
        setHeight(rect.height);
        setWidth(rect.width);

    }, []);


    const onSnapshotToolbarProvider = () => {
        return SnapshotToolbar({ onSave, content: snapshot })
    }
    const onSave = async (content: string) => {
        const newData: UpdateDockyFileData = { ...props.data, data: { content } };
        await callDockiesPut(newData);
        console.log("On Server")
    }

    return (
        <div className="border-gray-400 border-2 flex-1 w-full  h-full shrink p-0 overflow-auto" ref={tlDrawRef} >
            {
                // props && props.data!.data['content'] && props.data!.data['content'].length > 0 ?
                //, width: props.width
                <div id="boardEditor" style={{ position: 'fixed', inset: `0 0 0 450`, height: height - 100, width: width }} className="tldraw__editor">

                    {/* snapshot={jsonSnapshot} */}
                    <Tldraw
                        snapshot={snapshot}
                        components={{
                            SharePanel: onSnapshotToolbarProvider,
                        }}
                    />

                    {props.toolbar && <props.toolbar /* onSave={async () => { await onSave() }} onCancel={async () => { onCancel() } }*/></props.toolbar>}
                </div>
            }

        </div >
    )
}