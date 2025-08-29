

import { ViewContentProps } from '../DashContent/DockyContentTools';



export default function ArticlePlantUmlView(props: ViewContentProps) {
    return (
        <div className="border-gray-400 border-2 h-full w-full flex-col shrink p-4 overflow-auto">
            <div className='flex'>
                <div>
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
            </div>
            <div>
                {props.toolbar && <props.toolbar slug={props.data.slug} nav={() => props.nav}></props.toolbar>}
            </div>
        </div >
    )
}