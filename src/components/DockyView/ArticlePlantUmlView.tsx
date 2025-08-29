

import { ViewContentProps } from '../DashContent/DockyContentTools';



export default function ArticlePlantUmlView(props: ViewContentProps) {
    return (
        <div className="border-y-amber-600 border-2 w-full flex-col shrink p-4 overflow-auto">
            <div className='flex'>
                {props.data!.data['imgSrc'] &&
                    <img src={props.data!.data['imgSrc']} />
                }
                {!props.data!.data['imgSrc'] && props.data!.data['encoded'] &&
                    <img src={`http://www.plantuml.com/plantuml/img/${props.data!.data['encoded']}`} />
                }
            </div>
            <div >
                {props.data!.description && props.data.description}
            </div>
            <div>
                {props.toolbar && <props.toolbar slug={props.data.slug} nav={props.nav}></props.toolbar>}
            </div>
        </div >
    )
}