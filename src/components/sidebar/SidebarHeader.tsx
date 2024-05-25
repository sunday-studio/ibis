import { appWindow } from '@tauri-apps/api/window';
import { Maximize2, Minus, PanelRight, RefreshCcw, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { appState } from '@/store/app-state';

import { Tooltip } from '../tooltip/Tooltip';

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

        <Tooltip
          content="You are currently on the new version"
          hoverDuration={400}
          trigger={
            <div className="window-action" onClick={() => navigate(0)}>
              <RefreshCcw size={8} strokeWidth={3} />
            </div>
          }
        />
      </div>

      <Tooltip
        content="Close sidebar"
        shortcuts={['⌘', 'D']}
        trigger={
          <button
            className="sidebar-toggle"
            role="button"
            onClick={() => appState.toggleSidebarOpenState()}
          >
            <PanelRight size={18} />
          </button>
        }
      />
    </div>
  );
};
