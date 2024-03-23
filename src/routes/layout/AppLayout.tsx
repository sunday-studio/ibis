import { useEffect } from 'react';

import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useHotkeys } from 'react-hotkeys-hook';
import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { Key } from 'ts-key-enum';

import { PageTitleBar } from '@/components/page-titlebar/PageTitleBar';
import { Sidebar } from '@/components/sidebar/Sidebar';

import { SearchDialog } from '@/components';
import { SAFE_LOCATION_KEY } from '@/lib/constants';
import { loadDirectoryContent } from '@/lib/data-engine/syncing-helpers';
import { getData } from '@/lib/storage';
import { appState } from '@/store/app-state';
import { searchStore } from '@/store/search';

const AppLayout = observer(() => {
  useHotkeys(`${Key.Meta}+d`, () => appState.toggleSidebarOpenState());
  useHotkeys(`${Key.Control}+d`, () => appState.toggleSidebarOpenState());
  useHotkeys(`${Key.Meta}+k`, () => searchStore.toggleSearchModal());

  useEffect(() => {
    const SAFEURL = getData(SAFE_LOCATION_KEY);
    loadDirectoryContent(SAFEURL);
    appState.load();
  }, []);

  return (
    <div className="page-container">
      <SearchDialog />
      <div
        className={clsx('two-column-container', {
          'sidebar-closed': !appState.sidebarIsOpen,
        })}
      >
        <div className="sidebar-container">
          <Sidebar />
        </div>

        <div className="layout-divider"></div>
        <div className={clsx('page-wrapper')}>
          <PageTitleBar />
          <Outlet />
        </div>
      </div>
    </div>
  );
});

export default AppLayout;
