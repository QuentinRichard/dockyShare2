import { useDockyShareContext } from "@/app/dashboard/context";
import { callDivPost } from "@/app/lib/uses";
import { IPropertiesTable, PropertyTreeType } from "@/db/schema/property";
import { buildOptionSelection } from "../DashMenu/menuBuilder";


export interface DivDataForm {
    trees: IPropertiesTable[],
    parentId: number,
    type: PropertyTreeType
}

export interface DivFormProps {
    action: (state: boolean) => void
    data: DivDataForm
}



export default function CreateDivForm(props: DivFormProps) {
    const { setTrees } = useDockyShareContext();

    const getDivNameByParent = (parent: PropertyTreeType) => {
        let ret;
        switch (parent) {
            case PropertyTreeType.AdminLibraryDocky:
            case PropertyTreeType.AdminLibraryDockyDiv:
                ret = PropertyTreeType.AdminLibraryDockyDiv;
                break;
            case PropertyTreeType.AdminLibraryArticle:
            case PropertyTreeType.AdminLibraryArticleDiv:
                ret = PropertyTreeType.AdminLibraryArticleDiv;
                break;
            case PropertyTreeType.LibraryDocky:
            case PropertyTreeType.LibraryDockyDiv:
                ret = PropertyTreeType.LibraryDockyDiv;
                break;
            case PropertyTreeType.LibraryArticle:
            case PropertyTreeType.LibraryArticleDiv:
                ret = PropertyTreeType.LibraryArticleDiv;
                break;
            case PropertyTreeType.CalendarUpComming:
                break;
            case PropertyTreeType.Events:
            case PropertyTreeType.EventsDiv:
                ret = PropertyTreeType.EventsDiv;
                break;
            default:
                throw new Error('PropertyTreeType Type Unknown !!')
        }
        return ret;
    }

    const onAction = async (formData: FormData) => {

        //TODO add icon
        const tree: IPropertiesTable = {
            name: formData.get('name') as string,
            content: "",
            type: getDivNameByParent(props.data.type) as PropertyTreeType,
            parentId: props.data.parentId
        }
        const trees = await callDivPost(tree);
        if (trees) {
            setTrees(trees.data);
            props.action(true, `Le nouveau séparateur a été ajouté`);
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

                            <div className=" items-center justify-between">
                                <label htmlFor="tree_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an destination</label>
                                <select id="tree_id" size={4} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    defaultValue={props.data.parentId} name="tree_id">
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