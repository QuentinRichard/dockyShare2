

import { ViewProps } from './ViewProps';



export default function ArticlePlantUmlView(props: ViewProps) {
    return (
        <div className="border-gray-400 border-2 h-full w-full shrink p-4 overflow-auto">
            {props.data!.data['src'] &&
                <img src={`data:image/png;base64, ${props.data!.data['src']}`} />
            }
            {!props.data!.data['src'] && props.data!.data['content'] &&
                <img src={`http://www.plantuml.com/plantuml/img/${props.data!.data['encoded']}`} />
            }
        </div >
    )
}