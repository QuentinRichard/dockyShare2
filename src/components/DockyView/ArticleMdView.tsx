

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ViewContentProps } from '../DashContent/DockyContentTools';



export default function ArticleMdView(props: ViewContentProps) {
    return (
        <div className="border-red-400 border-2 w-full shrink p-4 overflow-auto">

            {props.data!.description && props.data.description}
            {props.data!.data['content'] &&
                < Markdown remarkPlugins={[remarkGfm]}>{props.data.data.content}</Markdown>
            }

            {props.toolbar && <props.toolbar slug={props.data.slug} nav={props.nav}></props.toolbar>}
        </div >
    )
}