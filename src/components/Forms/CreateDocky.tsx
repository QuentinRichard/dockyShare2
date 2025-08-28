import { useDockyShareContext } from "@/app/dashboard/context";
import { useTreesDefinition } from "@/app/lib/definition";
import { callDockiesPost, useTrees } from "@/app/lib/uses";
import DockyMenu from "@/components/DashMenu/DockyMenu";
import { DockyFileCatEnum, DockyFileTypeEnum, PostDockyFileData } from "@/db/schema/dockies";
import { IPropertiesTable } from "@/db/schema/property";
import { useState } from "react";


export interface DockyDataForm {
    trees: IPropertiesTable[],
    id: number
}

export interface DockyFormProps {
    action: (state: boolean, msg: string | undefined) => void
    data: DockyDataForm
}



export default function CreateDockyForm(props: DockyFormProps) {
    const { data, isError, isLoading } = useTrees(useTreesDefinition.TreeDocky);
    const [parentId, setParentId] = useState("");

    const onMenuClick = (id: number | string) => {
        setParentId(typeof id === 'number' ? id.toString() : id);
    }

    const { setDockies } = useDockyShareContext();


    const onAction = async (formData: FormData) => {
        //Send request
        formData.set('type', DockyFileTypeEnum.Docky)
        formData.set('cat', DockyFileCatEnum.Docky_Perso)
        //await createDockyAction(formData);
        const docky: PostDockyFileData = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            isPublic: formData.get('is_public') ? 1 : 0,
            treeId: Number(formData.get('tree_id')),
            data: {},
            type: DockyFileTypeEnum.Docky,
            cat: DockyFileCatEnum.Docky_Perso
        }
        const dockies = await callDockiesPost(docky);
        if (dockies) {
            setDockies(dockies.data);
            const found = dockies.data.find((dockyRes: IPropertiesTable) => dockyRes.id === dockies.new)
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
                                <label htmlFor="tree_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select a destination</label>
                                {!isLoading && data &&
                                    <div className="h-48 overflow-y-auto border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        {DockyMenu(data, undefined, undefined, undefined, onMenuClick)}
                                    </div>
                                }
                                {isLoading &&
                                    <div role="status">
                                        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                        </svg>
                                    </div>
                                }
                                {/* <select id="tree_id" size={4} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    defaultValue={props.data.id} name="tree_id">
                                    {buildOptionSelection(props.data.trees)}
                                </select> */}
                            </div>

                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button type="submit" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
                                    onClick={() => onAction}>Ok</button>{/* command="close" commandfor="dialog"  */}
                                <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                    onClick={() => { props.action(false, undefined) }}>Cancel</button>{/* command="close" commandfor="dialog"  */}
                            </div>
                        </form>
                    </div>
                </div >
            </section >
        </div >
    );
}