import { Outlet } from 'react-router';

import { Sidebar, ProductNavigation } from './Sidebar';

export const AppLayout = () => {
  return (
    <div className="flex h-screen font-display text-md overflow-hidden">
      <div className="w-[50px] h-full bg-neutral-100 shrink-0 border-r border-gray-100">
        <ProductNavigation />
      </div>

      <div className="w-[300px] h-full border-r border-neutral-100 shrink-0 shadow-sm">
        <Sidebar />
      </div>

      <div className="bg-white w-full">
        <Outlet />
      </div>
    </div>
  );
};
