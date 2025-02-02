import { Outlet } from 'react-router';

import { Sidebar } from './Sidebar';

export const AppLayout = () => {
  return (
    <div className="flex h-screen">
      <div className="w-[350px] bg-gray-50 h-full border-r border-gray-100">
        <Sidebar />
      </div>

      <div className="bg-white w-full">
        <Outlet />
      </div>
    </div>
  );
};
