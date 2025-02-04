import { Outlet } from 'react-router';

import { Sidebar } from './Sidebar';

export const AppLayout = () => {
  return (
    <div className="flex h-screen font-display text-md">
      <div className="w-[350px] h-full border-r border-gray-100 shrink-0">
        <Sidebar />
      </div>

      <div className="bg-white w-full">
        <Outlet />
      </div>
    </div>
  );
};
