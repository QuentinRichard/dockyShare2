import AdminTree from '@/components/AdminTree/AdminTree';

export default function Home() {


  return (
    <div id='homePage'>
      <aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
        <AdminTree data={[]} /> {/*onClick={onPropertyClick} */}
      </aside>

      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">

        </div>
      </div>
    </div>
  );
}
