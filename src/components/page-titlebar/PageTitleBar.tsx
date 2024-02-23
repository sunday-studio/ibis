import clsx from 'clsx';
import { CheckCheck, PanelLeft, RotateCw, X } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { appState } from '@/store/app-state';
import { entriesStore } from '@/store/entries';

// type ActiveTabProps = {
//   title: string;
//   onClose: () => void;
//   onClick: () => void;
//   isActive?: boolean;
// };

// const ActiveTab = ({ title, onClose, onClick, isActive }: ActiveTabProps) => {
//   return (
//     <div
//       className={clsx('tab', {
//         'tab-active': isActive,
//       })}
//       onClick={onClick}
//     >
//       <p className="tab-title satoshi-font">{title}</p>
//       <div className="close-button" onClick={onClose}>
//         <X size={14} strokeWidth={3} />
//       </div>
//     </div>
//   );
// };

export const PageTitleBar = observer(() => {
  const currentEntryTitle = entriesStore.activeEntry?.title;

  return (
    <div className={clsx('page-titlebar', 'multi-page')} data-tauri-drag-region>
      {!appState.sidebarIsOpen && (
        <div className="sidebar-toggle-container">
          {/* <div className="saving-indicator">
            <CheckCheck size={18} color="green" />
            <RotateCw size={18} color="green" className="loading-indicator" />
          </div> */}
          <div className="sidebar-toggle" onClick={() => appState.toggleSidebarOpenState()}>
            <PanelLeft size={18} />
          </div>
        </div>
      )}

      {/* 
      <div className="tabs" data-tauri-drag-region>
        <ActiveTab title={currentEntryTitle} />
        <ActiveTab title={currentEntryTitle} isActive />
      </div> */}

      <p className="single-title">{currentEntryTitle}</p>
    </div>
  );
});
