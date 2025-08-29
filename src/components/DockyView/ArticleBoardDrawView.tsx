

import 'tldraw/tldraw.css';
import { ViewProps } from './ViewProps';



export default function ArticleBoardDrawView(props: ViewProps) {

    return (
        <div className="border-gray-400 border-2 h-full w-full shrink p-4 overflow-auto">
            {props.data!.data['src'] &&
                <img src={props.data!.data['src']} />
            }
            <div>
                {props.data!.data['imgSrc'] &&
                    <img src={props.data!.data['imgSrc']} />
                }
            </div>
            <div >
                {props.data!.description && props.data.description}
            </div>
            {/* onSave={async () => { await onSave() }} onCancel={async () => { onCancel() }} */}
            {props.toolbar && <props.toolbar slug={props.data.slug}></props.toolbar>}
        </div >
    )
}