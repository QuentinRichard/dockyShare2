import { useTrees } from '@/app/lib/uses';
import { IPropertiesTable } from '@/db/schema/property';
import { DynamicIcon } from 'lucide-react/dynamic';
import { useState } from 'react';

export default function DashMenu() {

    const [expendedId, setExpendedId] = useState(0);
    const { trees, isLoading, isError } = useTrees();

    const containsSelected = (item: IPropertiesTable) => {
        if (item.id === expendedId)
            return true
        else {
            let ret = false;
            item.children?.forEach(child => {
                if (containsSelected(child))
                    ret = true;
            });
            return ret;
        }
    }

    return (
        <div id="sidebar-multi-level-sidebar" className="w-80 h-full border-2 border-black transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar" >
            <div className="h-full px-3 py-4 overflow-y-auto bg-amber-50 dark:bg-gray-800">
                {trees &&
                    <ul className="space-y-2 font-medium">
                        {trees?.map((item: IPropertiesTable) => {
                            return item.children!.length === 0 ?
                                <li>
                                    <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                        {item.icon && item.icon.length > 0 && <DynamicIcon name={item.icon} size={44} className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />}
                                        <span className="ms-3">{item.name}</span>
                                    </a>
                                </li>
                                :
                                <li>
                                    <button type="button" className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" aria-controls="dropdown-example" data-collapse-toggle="dropdown-example" onClick={() => { setExpendedId(item.id! === expendedId ? 0 : item.id!); }}>
                                        {item.icon && item.icon.length > 0 && <DynamicIcon name={item.icon} size={44} className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />}
                                        <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">E-commerce</span>
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                        </svg>
                                    </button>
                                    <ul id="dropdown-example" className=" py-2 space-y-2" hidden={!containsSelected(item)}>

                                        {item.children!.map((child) =>
                                            <li>
                                                <a href="#" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                                                    {child.icon && child.icon.length > 0 && <DynamicIcon name={child.icon} size={44} className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />}
                                                    <span className="ms-3">{child.name}</span>
                                                </a>
                                            </li>
                                        )}

                                    </ul>
                                </li>
                        }

                        )}
                    </ul >
                }
                {(isLoading && !isError) &&
                    <div>
                        <div role="status">
                            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            {/* <span className="sr-only">Loading...</span> */}
                        </div>
                    </div>
                }
                {(isError) &&
                    <div>
                        <div role="status">
                            <span className="sr-only">Error : {JSON.stringify(isError)}</span>
                        </div>
                    </div>
                }
            </div>
        </div >


    );
}
