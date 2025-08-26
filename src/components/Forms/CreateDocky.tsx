import { useDockyShareContext } from "@/app/dashboard/context";
import { callDockiesPost } from "@/app/lib/uses";
import { DockyFileCatEnum, DockyFileData, DockyFileTypeEnum } from "@/db/schema/dockies";
import { IPropertiesTable } from "@/db/schema/property";
import { buildOptionSelection } from "../DashMenu/menuBuilder";


export interface DockyDataForm {
    trees: IPropertiesTable[],
    id: number
}

export interface DockyFormProps {
    action: (state: boolean) => void
    data: DockyDataForm
}



export default function CreateDockyForm(props: DockyFormProps) {
    const { setDockies } = useDockyShareContext();


    const onAction = async (formData: FormData) => {
        //Send request
        formData.set('type', DockyFileTypeEnum.Docky)
        formData.set('cat', DockyFileCatEnum.Docky_Perso)
        //await createDockyAction(formData);
        const docky: DockyFileData = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            isPublic: formData.get('is_public') ? 1 : 0,
            treeId: Number(formData.get('tree_id')),
            type: DockyFileTypeEnum.Docky,
            cat: DockyFileCatEnum.Docky_Perso
        }
        const dockies = await callDockiesPost(docky);
        if (dockies) {
            setDockies(dockies.data);
            const found = dockies.data.find((dockyRes) => dockyRes.id === dockies.new)
            props.action(true, `Le slug du nouveau document est: ${found.slug}`);
            return;
        }
        props.action(false, "Error Unknown");
    }

    return (
        < div >
            <section>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <form className="space-y-4 md:space-y-6" action={async (formData) => { onAction(formData) }}>
                            <div>
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                <input type="name" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name" required={true} />
                            </div>
                            <div>
                                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                <input type="text" name="description" id="description" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Summary, presentation ..." required={true} />
                            </div>
                            <div className="flex items-center mb-4">
                                <input id="default-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    name="is_public" />
                                <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Is Public</label>
                            </div>
                            <div className=" items-center justify-between">
                                <label htmlFor="tree_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an destination</label>
                                <select id="tree_id" size={4} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    defaultValue={props.data.id} name="tree_id">
                                    {buildOptionSelection(props.data.trees)}
                                </select>
                            </div>

                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button type="submit" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
                                    onClick={() => onAction}>Ok</button>{/* command="close" commandfor="dialog"  */}
                                <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                    onClick={() => { props.action(false) }}>Cancel</button>{/* command="close" commandfor="dialog"  */}
                            </div>
                        </form>
                    </div>
                </div >
            </section >
        </div >
    );
}