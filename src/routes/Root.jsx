import { observer } from 'mobx-react-lite';
import { useHotkeys } from 'react-hotkeys-hook';
import { Outlet } from 'react-router-dom';
import { Key } from 'ts-key-enum';

import { Sidebar } from '../components/Sidebar';
import { appState } from '../store/app-state';

const SIDEBAR_WIDTH = 300;

const Root = observer(() => {
  useHotkeys(`${Key.Meta}+s`, () => appState.toggleSidebarOpenState());
  useHotkeys(`${Key.Control}+s`, () => appState.toggleSidebarOpenState());

  return (
    <div className="page-container">
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
          className="page-wrapper"
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
