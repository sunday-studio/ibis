import { motion } from 'framer-motion';
import { Outlet } from 'react-router';
import { useSnapshot } from 'valtio';

import { editorModeState, sidebarState } from '@/app.store';
import { useRegisterAllShortcuts } from '@/hooks/useRegisterGlobalShortcuts';

import { CommandDialog } from './CommandDialog';
import { Header } from './Header/Header';
import { ProductNavigation, Sidebar } from './Sidebar';

export const AppLayout = () => {
  const isSidebarOpen = useSnapshot(sidebarState).isSidebarOpen;
  const isFocusMode = useSnapshot(editorModeState).isFocusMode;
  useRegisterAllShortcuts();

  return (
    <>
      <CommandDialog />
      <div
        className="flex h-screen flex-col font-display text-md overflow-hidden bg-stone-100 dark:bg-stone-900 dark:text-stone-100"
        data-editor-mode={isFocusMode ? 'focus' : 'normal'}
      >
        <Header />
        <div
          className="flex overflow-hidden w-full bg-transparent px-2 py-0.5 h-full"
          data-tauri-drag-region
        >
          <motion.div
            animate={{ width: isSidebarOpen ? 'auto' : 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <div className="flex h-full">
              <div className="w-[50px] h-full shrink-0" data-tauri-drag-region>
                <ProductNavigation />
              </div>
              <div className="w-[250px] h-full shrink-0" data-tauri-drag-region>
                <Sidebar />
              </div>
            </div>
          </motion.div>

          <div className="bg-white w-full overflow-y-auto shadow-1 rounded-lg dark:bg-stone-950 app-content relative h-full">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};
