
export interface EventFormProps {
    action: (state: boolean, msg: string | undefined) => void
}


export default function CreateEventForm(props: EventFormProps) {
    const onAction = async () => {
        //Send request
        // Valide action
        props.action(true, undefined);
    }
    return (

        <div>
            <span>dev</span>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button type="button" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={() => onAction}>Ok</button>{/* command="close" commandfor="dialog"  */}
                <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => { props.action(false, undefined) }}>Cancel</button>{/* command="close" commandfor="dialog"  */}
            </div>
        </div>
    );
}