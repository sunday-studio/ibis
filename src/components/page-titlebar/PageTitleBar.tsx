import clsx from 'clsx';
import { PanelLeft } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { appState } from '@/store/app-state';
import { entriesStore } from '@/store/entries';

export const PageTitleBar = observer(() => {
  const currentEntryTitle = entriesStore.activeEntry?.title;

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
    </div>
  );
});
