import { Outlet } from 'react-router';

export const DashboardLayout = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <Outlet />
    </div>
  );
};
