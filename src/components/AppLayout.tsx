import { Outlet } from 'react-router';
import { motion } from 'framer-motion';
import { Sidebar, ProductNavigation } from './Sidebar';
import { useSnapshot } from 'valtio';
import { sidebarState, setSidebarState } from '@/app.store';
import { useRegisterAllShortcuts } from '@/hooks/useRegisterGlobalShortcuts';

export const AppLayout = () => {
  const isSidebarOpen = useSnapshot(sidebarState).isSidebarOpen;

  useRegisterAllShortcuts();

  return (
    <div className="flex h-screen font-display text-md overflow-hidden bg-stone-100 dark:bg-stone-900 dark:text-stone-100">
      <div
        className="rounded-lg flex overflow-hidden w-full bg-transparent p-1.5"
        data-tauri-drag-region
      >
        <motion.div animate={{ width: isSidebarOpen ? 'auto' : '0px' }}>
          <div className="flex h-full">
            <div className="w-[50px] h-full shrink-0" data-tauri-drag-region>
              <ProductNavigation />
            </div>
            <div className="w-[250px] h-full shrink-0" data-tauri-drag-region>
              <Sidebar />
            </div>
          </div>
        </motion.div>

        <div className="bg-white w-full overflow-y-auto shadow-1 rounded-lg dark:bg-stone-800">
          <button onClick={() => setSidebarState(!isSidebarOpen)}>Toggle</button>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
