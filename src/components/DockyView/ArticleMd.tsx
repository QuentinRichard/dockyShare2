
//Use for public page
// import Markdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';

import '@/../node_modules/@mdxeditor/editor/dist/style.css';
import './style.css';

import { callDockiesPut } from '@/app/lib/uses';
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

const emptyMD = `
`;

export default function ArticleMdView(props: ViewProps) {// DockyFileData
    const mdStr = `# This is a H1  \n## This is a H2  \n###### This is a H6`;
    const [markdown, setMarkdown] = useState(props.data!.data['content'] || emptyMD);
    const [key, setKey] = useState(Date.now());

    console.log("ArticleMdView", props.data);
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
        <div key={`${key}`} className="border-gray-400 border-2 h-full w-full shrink p-4 overflow-auto">
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
    )
}