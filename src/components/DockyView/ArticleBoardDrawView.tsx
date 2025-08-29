

import 'tldraw/tldraw.css';
import { ViewContentProps } from '../DashContent/DockyContentTools';



export default function ArticleBoardDrawView(props: ViewContentProps) {
    console.log('props.data!.data!', props.data!.data!)

    return (
        <div className="border-gray-400 border-2 h-full w-full shrink p-4 overflow-auto">

            {props.data!.data!['content']!['imgSrc'] &&
                <img src={props.data!.data!['content']!['imgSrc']} />
            }
            <div >
                {props.data!.description && props.data.description}
                b
            </div>
            {/* onSave={async () => { await onSave() }} onCancel={async () => { onCancel() }} */}
            {props.toolbar && <props.toolbar slug={props.data.slug} nav={() => props.nav}></props.toolbar>}
        </div >
    )
}