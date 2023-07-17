import { Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useHotkeys } from 'react-hotkeys-hook';
import { Key } from 'ts-key-enum';

import { Sidebar } from '../components/Sidebar';
import { appState } from '../store/app-state';

const Root = observer(() => {
  useHotkeys(`${Key.Meta}+s`, () => appState.toggleSidebarOpenState());
  useHotkeys(`${Key.Control}+s`, () => appState.toggleSidebarOpenState());

  return (
    <>
      <div className="page-container">
        <div
          className="two-column-container"
          data-sidebar-state={`${appState.sidebarIsOpen ? 'true' : 'false'}`}
        >
          <div className="sidebar-container">
            <Sidebar />
          </div>
          <Outlet />
        </div>
      </div>
    </>
  );
});

export default Root;
