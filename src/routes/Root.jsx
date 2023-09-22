import { useEffect } from 'react';

import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useHotkeys } from 'react-hotkeys-hook';
import { ScrollRestoration, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { Key } from 'ts-key-enum';

import { Sidebar } from '../components/Sidebar/Sidebar';
import { appState } from '../store/app-state';
import { dailyEntryState } from '../store/daily-state';

const SIDEBAR_WIDTH = 300;

const Root = observer(() => {
  useHotkeys(`${Key.Meta}+d`, () => appState.toggleSidebarOpenState());
  useHotkeys(`${Key.Control}+d`, () => appState.toggleSidebarOpenState());

  const location = useLocation();

  useEffect(() => {
    dailyEntryState.load();
    appState.load();
  }, []);

  const isEntryPageActive = location.pathname.includes('entry');

  return (
    <div className="page-container">
      {/* <ScrollRestoration /> */}
      <div className="two-column-container">
        <div
          className="sidebar-container"
          style={{
            display: appState.sidebarIsOpen ? 'flex' : 'none',
          }}
        >
          <Sidebar />
        </div>
        <div className="ruler"></div>
        <div
          className={clsx('page-wrapper', {
            'page-wrapper__withborder': isEntryPageActive,
          })}
          style={{
            width: appState.sidebarIsOpen ? `calc(100% - ${SIDEBAR_WIDTH}` : '100%',
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
});

export default Root;
