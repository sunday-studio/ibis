import { proxy } from 'valtio';

export const sidebarState = proxy({
  isSidebarOpen: false,
});

export const setSidebarState = (isSidebarOpen: boolean) => {
  sidebarState.isSidebarOpen = isSidebarOpen;
};

export const toggleSidebarState = () => {
  sidebarState.isSidebarOpen = !sidebarState.isSidebarOpen;
};
