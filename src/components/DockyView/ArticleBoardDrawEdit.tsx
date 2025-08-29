

import { callDockiesPut } from '@/app/lib/uses';
import { UpdateDockyFileData } from '@/db/schema/dockies';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TLEditorSnapshot, TLUserPreferences, Tldraw, getSnapshot, loadSnapshot, useEditor, useTldrawUser } from 'tldraw';
import 'tldraw/tldraw.css';
import { ViewProps } from './ViewProps';

import _jsonSnapshot from './boardDrawInit.json';

/* @typescript-eslint/no-explicit-any */
const jsonSnapshot = _jsonSnapshot as unknown as TLEditorSnapshot


function SnapshotToolbar(props: { onSave: (content: string) => void, content: string }) {
    const editor = useEditor()
    const [snapshot] = useState(props.content ? JSON.parse(props.content) : jsonSnapshot)

    const save = useCallback(async () => {
        const { document, session } = getSnapshot(editor.store)
        console.log('document', JSON.stringify({ document, session }))
        if (props.onSave) props.onSave(JSON.stringify({ document, session }))
    }, [editor])

    const load = useCallback(() => {
        loadSnapshot(editor.store, snapshot)
    }, [editor])

    const [showCheckMark, setShowCheckMark] = useState(false)
    useEffect(() => {
        if (editor && snapshot)
            loadSnapshot(editor.store, snapshot);

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
    const [snapshot, setSnapshot] = useState(props.data!.data['content'] || jsonSnapshot)
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
        const newData: UpdateDockyFileData = { ...props.data, data: { content, imgSrc: '' } };
        await callDockiesPut(newData);
        console.log("On Server")
    }

    return (
        <div className="border-gray-400 border-2 flex-1 w-full  h-full shrink p-0 overflow-auto" ref={tlDrawRef} >
            {
                // props && props.data!.data['content'] && props.data!.data['content'].length > 0 ?
                //, width: props.width
                <div style={{ position: 'fixed', inset: `0 0 0 450`, height: height - 100, width: width }} className="tldraw__editor">

                    {/* snapshot={jsonSnapshot} */}
                    <Tldraw
                        snapshot={JSON.parse(snapshot)}
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