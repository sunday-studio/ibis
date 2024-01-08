import { appState } from '@/store/app-state';
import { appWindow } from '@tauri-apps/api/window';
import { Maximize2, Minus, PanelRight, RefreshCcw, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SidebarHeader = () => {
  const navigate = useNavigate();

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

        <div className="window-action" onClick={() => navigate(0)}>
          <RefreshCcw size={8} strokeWidth={3} />
        </div>
      </div>

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
