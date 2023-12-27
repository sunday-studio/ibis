import { appState } from '@/store/app-state';
import { appWindow } from '@tauri-apps/api/window';
import { CheckCheck, Maximize2, Minus, PanelRight, RotateCw, X } from 'lucide-react';

export const SidebarHeader = () => {
  return (
    <div className="sidebar-header" data-tauri-drag-region>
      <div className="window-actions">
        <div className="window-action" onClick={() => appWindow.close()}>
          <X size={8} strokeWidth={4} />
        </div>
        <div className="window-action" onClick={() => appWindow.minimize()}>
          <Minus size={8} strokeWidth={4} />
        </div>
        <div className="window-action" onClick={() => appWindow.maximize()}>
          <Maximize2 size={8} strokeWidth={3} />
        </div>
      </div>

      {/* <div className="saving-indicator">
        <CheckCheck size={18} color="green" />
        <RotateCw size={18} color="green" className="loading-indicator" />
      </div> */}

      <div
        className="sidebar-toggle"
        role="button"
        onClick={() => appState.toggleSidebarOpenState()}
      >
        <PanelRight size={18} />
      </div>
    </div>
  );
};
