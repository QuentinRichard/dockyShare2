
//Use for public page
// import Markdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';

import '@/../node_modules/@mdxeditor/editor/dist/style.css';
import './style.css';

import { callDockiesPut } from '@/app/lib/uses';
import { emptyMD } from '@/components/DashContent/DockyContentTools';
import { UpdateDockyFileData } from '@/db/schema/dockies';
import {
    BlockTypeSelect, BoldItalicUnderlineToggles,
    ChangeCodeMirrorLanguage, codeBlockPlugin, codeMirrorPlugin, CodeToggle, ConditionalContents, CreateLink,
    diffSourcePlugin,
    headingsPlugin, imagePlugin,
    InsertCodeBlock,
    InsertImage,
    InsertTable, InsertThematicBreak, linkDialogPlugin, linkPlugin, listsPlugin, ListsToggle, markdownShortcutPlugin, MDXEditor, quotePlugin,
    ShowSandpackInfo, tablePlugin, thematicBreakPlugin, toolbarPlugin, UndoRedo
} from '@mdxeditor/editor';
import { useState } from 'react';
import { ViewProps } from './ViewProps';


export default function ArticleMdEdit(props: ViewProps) {// DockyFileData
    const [markdown, setMarkdown] = useState(props.data!.data['content'] || emptyMD);
    const [key, setKey] = useState(Date.now());

    const onContentChange = (md: string) => {
        if (md.length === 0) md = emptyMD;
        setMarkdown(md);
        // if (props.onUpdate) {
        //     props.onUpdate({ ...props.data, data: { content: md } });
        // }
    }
    const onSave = async () => {
        console.log("Save", markdown);
        const newData: UpdateDockyFileData = { ...props.data, data: { content: markdown } };
        await callDockiesPut(newData);
    }

    const onCancel = () => {
        setMarkdown(props.data!.data['content'] || emptyMD);
        setKey(Date.now());
        console.log("Cancel");
    }
    return (
        <div key={`${key}`} className="border-gray-400 border-2  w-full shrink p-4 overflow-auto" >

            {/* style={{ height: props.height, width: props.width }} */}
            <div className="flex flex-col relative"  >
                {/* //TODO Add all property formular ;) -)*/}
                {markdown &&
                    <MDXEditor
                        contentEditableClassName="prose"
                        markdown={markdown}
                        onChange={(md) => { console.log(`md[${md}]`); onContentChange(md) }}
                        plugins={[
                            headingsPlugin(),
                            listsPlugin(),
                            quotePlugin(),
                            linkPlugin(),
                            linkDialogPlugin(),
                            tablePlugin(),

                            imagePlugin({
                                imageUploadHandler: () => {
                                    return Promise.resolve('https://picsum.photos/200/300')
                                },
                                imageAutocompleteSuggestions: ['https://picsum.photos/200/300', 'https://picsum.photos/200']
                            }),
                            thematicBreakPlugin(),
                            markdownShortcutPlugin(),
                            codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
                            codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS' } }),
                            diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: 'boo' }),
                            toolbarPlugin({
                                toolbarClassName: 'my-classname',
                                toolbarContents: () => (
                                    <>
                                        <UndoRedo />
                                        <InsertThematicBreak />
                                        <BlockTypeSelect />
                                        <BoldItalicUnderlineToggles />
                                        <CodeToggle />
                                        <CreateLink />
                                        <InsertImage />
                                        <InsertTable />
                                        <ListsToggle />
                                        <ConditionalContents
                                            options={[
                                                { when: (editor) => editor?.editorType === 'codeblock', contents: () => <ChangeCodeMirrorLanguage /> },
                                                { when: (editor) => editor?.editorType === 'sandpack', contents: () => <ShowSandpackInfo /> },
                                                {
                                                    fallback: () => (
                                                        <>
                                                            <InsertCodeBlock />
                                                        </>
                                                    )
                                                }
                                            ]}
                                        />

                                    </>
                                )
                            })
                        ]}
                    />}
                {props.toolbar && <props.toolbar onSave={async () => { await onSave() }} onCancel={async () => { onCancel() }}></props.toolbar>}

                {/* ==> Note init:
            https://mdxeditor.dev/editor/docs/links

            */}
            </div>
        </div>
    )
}