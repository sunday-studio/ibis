import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import { useHotkeys } from 'react-hotkeys-hook';
import { ScrollRestoration, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { Key } from 'ts-key-enum';

import { Sidebar } from '../components/Sidebar';
import { appState } from '../store/app-state';

const SIDEBAR_WIDTH = 300;

const Root = observer(() => {
  useHotkeys(`${Key.Meta}+s`, () => appState.toggleSidebarOpenState());
  useHotkeys(`${Key.Control}+s`, () => appState.toggleSidebarOpenState());

  const location = useLocation();

  const isEntryPageActive = location.pathname.includes('entry');

  return (
    <div className="page-container">
      <ScrollRestoration />
      <div className="two-column-container">
        <div
          className="sidebar-container"
          style={{
            display: appState.sidebarIsOpen ? 'flex' : 'none',
          }}
        >
          <Sidebar />
        </div>
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
