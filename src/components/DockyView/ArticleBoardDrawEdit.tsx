

import { callDockiesPut } from '@/app/lib/uses';
import { UpdateDockyFileData } from '@/db/schema/dockies';
import { useCallback, useEffect, useState } from 'react';
import { TLEditorSnapshot, Tldraw, getSnapshot, loadSnapshot, useEditor } from 'tldraw';
import 'tldraw/tldraw.css';
import { ViewProps } from './ViewProps';

import _jsonSnapshot from './boardDrawInit.json';

const jsonSnapshot = _jsonSnapshot as any as TLEditorSnapshot


function SnapshotToolbar(props: { onSave: (content: string) => void, content: string }) {
    const editor = useEditor()
    const [snapshot] = useState(props.content ? JSON.parse(props.content) : undefined)

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

    const onSnapshotToolbarProvider = () => {
        return SnapshotToolbar({ onSave, content: snapshot })
    }
    const onSave = async (content: string) => {
        const newData: UpdateDockyFileData = { ...props.data, data: { content } };
        await callDockiesPut(newData);
        console.log("On Server")
    }

    return (
        <div className="border-gray-400 border-2 flex-1 w-full  h-full shrink p-4 overflow-auto">

            {
                // props && props.data!.data['content'] && props.data!.data['content'].length > 0 ?
                <div style={{ position: 'fixed', inset: 0 }} className="tldraw__editor"
                    style={{ height: 750 }}>

                    {/* snapshot={jsonSnapshot} */}
                    <Tldraw
                        snapshot={JSON.parse(snapshot)}
                        components={{
                            SharePanel: onSnapshotToolbarProvider,
                        }}
                    />

                    {props.toolbar && <props.toolbar /* onSave={async () => { await onSave() }} onCancel={async () => { onCancel() } }*/></props.toolbar>}
                </div>
                // : <div>Pas de données</div>
            }

        </div >
    )
}