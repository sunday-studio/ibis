import { useEffect, useState } from 'react';

import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { Outlet, useNavigate } from 'react-router-dom';

import { PageTitleBar } from '@/components/page-titlebar/PageTitleBar';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { SplashScreen } from '@/components/splash-screen/SplashScreen';

import { SearchDialog } from '@/components';
import { useRegisterAllShortcuts } from '@/hooks/useRegisterAllShortcuts';
import { SAFE_LOCATION_KEY } from '@/lib/constants';
import { loadDirectoryContent } from '@/lib/data-engine/syncing-helpers';
import { getData } from '@/lib/storage';
import { appState } from '@/store/app-state';

const AppLayout = observer(() => {
  const [showSplashScreen, setShowSplashScreen] = useState(false);
  const navigate = useNavigate();
  useRegisterAllShortcuts();

  useEffect(() => {
    const SAFEURL = getData(SAFE_LOCATION_KEY);

    if (SAFEURL) {
      appState.load();
      loadDirectoryContent(SAFEURL);
      return;
    }
    navigate('/safe');
  }, []);

  return (
    <div className="page-container">
      {showSplashScreen && <SplashScreen />}

      <SearchDialog />

      <div
        className={clsx('two-column-container', {
          'sidebar-closed': !appState.sidebarIsOpen,
        })}
      >
        <div className="sidebar-container" data-tauri-drag-region>
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
