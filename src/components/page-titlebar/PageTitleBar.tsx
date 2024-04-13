import clsx from 'clsx';
import { PanelLeft } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { SAFE_LOCATION_KEY } from '@/lib/constants';
import { getData } from '@/lib/storage';
import { appState } from '@/store/app-state';
import { entriesStore } from '@/store/entries';

export const PageTitleBar = observer(() => {
  const currentEntryTitle = entriesStore.activeEntry?.title;

  const SAFE_NAME = getData(SAFE_LOCATION_KEY)?.split('/').pop();

  return (
    <div
      className={clsx('page-titlebar', {
        'side-opened': appState.sidebarIsOpen,
      })}
      data-tauri-drag-region
    >
      {!appState.sidebarIsOpen && (
        <div className="sidebar-toggle-container">
          <div className="sidebar-toggle" onClick={() => appState.toggleSidebarOpenState()}>
            <PanelLeft size={18} />
          </div>
        </div>
      )}

      <p className="single-title">{currentEntryTitle}</p>

      {SAFE_NAME && <p className="safe-name">{SAFE_NAME}</p>}
    </div>
  );
});
