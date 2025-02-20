import { Outlet } from 'react-router';

import { Sidebar, ProductNavigation } from './Sidebar';

export const AppLayout = () => {
  return (
    <div className="flex h-screen font-display text-md overflow-hidden border-t border-gray-100 p-2 bg-[#e5dfd5b4]">
      <div className="rounded-lg flex overflow-hidden w-full bg-white">
        <div className="w-[50px] h-full shrink-0 border-r border-gray-100">
          <ProductNavigation />
        </div>

        <div className="w-[250px] h-full border-r border-neutral-100 shrink-0 bg-white">
          <Sidebar />
        </div>

        <div className="bg-white w-full overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
