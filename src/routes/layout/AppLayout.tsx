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
import { dailyEntryState } from '@/store/daily-state';
import { searchStore } from '@/store/search';

import { appState } from '../../store/app-state';

const SIDEBAR_WIDTH = 300;

const AppLayout = observer(() => {
  useHotkeys(`${Key.Meta}+d`, () => appState.toggleSidebarOpenState());
  useHotkeys(`${Key.Control}+d`, () => appState.toggleSidebarOpenState());
  useHotkeys(`${Key.Meta}+k`, () => searchStore.toggleSearchModal());

  const location = useLocation();

  useEffect(() => {
    const SAFEURL = getData(SAFE_LOCATION_KEY);
    loadDirectoryContent(SAFEURL);
    appState.load();
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
