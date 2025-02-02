import { Outlet } from 'react-router';

import { Sidebar } from './Sidebar';

export const AppLayout = () => {
  return (
    <div className="flex h-screen">
      <div className="w-[350px] bg-white h-full p-2 border-r border-gray-100">
        <Sidebar />
      </div>

      <div className="bg-gray-50 w-full">
        <Outlet />
      </div>
    </div>
  );
};
