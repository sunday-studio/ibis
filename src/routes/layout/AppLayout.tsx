import { useEffect } from 'react';

import { SearchDialog } from '@/components';
import { searchStore } from '@/store/search';
import { register, unregisterAll } from '@tauri-apps/api/globalShortcut';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

import { PageTitleBar } from '@/components/page-titlebar/PageTitleBar';
import { Sidebar } from '@/components/sidebar/Sidebar';

import { appState } from '../../store/app-state';
import { dailyEntryState } from '../../store/daily-state';

const SIDEBAR_WIDTH = 300;

const AppLayout = observer(() => {
  const location = useLocation();

  const registerShortcuts = async () => {
    await register('CommandOrControl+d', () => appState.toggleSidebarOpenState());
    await register('CommandOrControl+k', () => searchStore.toggleSearchModal());
  };

  const unregisterShortcuts = async () => {
    await unregisterAll();
  };

  useEffect(() => {
    dailyEntryState.load();
    appState.load();
    registerShortcuts();

    return () => {
      unregisterShortcuts();
    };
  }, []);

  const isEntryPageActive = location.pathname.includes('entry');

  return (
    <div className="page-container">
      <SearchDialog />
      <div className="two-column-container">
        <div
          className="sidebar-container"
          style={{
            display: appState.sidebarIsOpen ? 'flex' : 'none',
          }}
        >
          <Sidebar />
        </div>
        <div className="layout-divider"></div>
        <div
          className={clsx('page-wrapper', {
            'page-wrapper__withborder': isEntryPageActive,
          })}
          style={{
            width: appState.sidebarIsOpen ? `calc(100% - ${SIDEBAR_WIDTH}` : '100%',
          }}
        >
          <PageTitleBar />
          <Outlet />
        </div>
      </div>
    </div>
  );
});

export default AppLayout;
