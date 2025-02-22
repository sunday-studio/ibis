import { Outlet } from 'react-router';

import { Sidebar, ProductNavigation } from './Sidebar';

export const AppLayout = () => {
  return (
    <div className="flex h-screen font-display text-md overflow-hidden bg-stone-100 dark:bg-stone-900">
      <div
        className="rounded-lg flex overflow-hidden w-full bg-transparent p-1.5"
        data-tauri-drag-region
      >
        <div className="w-[50px] h-full shrink-0" data-tauri-drag-region>
          {/* <ProductNavigation /> */}
        </div>
        <div className="w-[250px] h-full  shrink-0" data-tauri-drag-region>
          {/* <Sidebar /> */}
        </div>
        <div className="bg-white w-full overflow-y-auto shadow-1 rounded-lg dark:bg-stone-800">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
