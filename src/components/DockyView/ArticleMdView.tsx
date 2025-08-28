

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ViewProps } from './ViewProps';



export default function ArticleMdView(props: ViewProps) {
    return (
        <div className="border-gray-400 border-2 h-full w-full shrink p-4 overflow-auto">
            {props.data!.data['content'] &&
                < Markdown remarkPlugins={[remarkGfm]}>{props.data.data.content}</Markdown>
            }
        </div >
    )
}