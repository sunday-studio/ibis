import { FC } from 'react';

import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import clsx from 'clsx';
import { Maximize2, Minus, PanelRight, RefreshCcw, X } from 'lucide-react';
import { useSnapshot } from 'valtio';

import { sidebarState, toggleSidebarState } from '@/app.store';

import { Button } from '../Button';
import { Tooltip } from '../Tooltip';
import { type HeaderTile, headerState, removeTile, useSelectTile } from './header.store';

interface SelectedTileProps extends HeaderTile {
  onClose: (tileId: string) => void;
  isActive?: boolean;
  onClick: (tileId: string) => void;
}

const SelectedTile: FC<SelectedTileProps> = ({ title, onClose, isActive, id, onClick }) => {
  return (
    <Button
      variant="unstyled"
      onPress={() => onClick(id)}
      className={clsx('flex gap-1 pl-2 pr-1 items-center justify-between rounded-lg', {
        'bg-stone-200 hover:bg-stone-300 dark:bg-stone-700 dark:hover:bg-stone-600': isActive,
      })}
    >
      <span className="relative flex items-center justify-center size-4 mx-1">
        {isActive ? (
          <>
            <span className="relative flex items-center justify-center size-2">
              <span className="absolute inline-flex h-full size-2  w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-green-500"></span>
            </span>
          </>
        ) : (
          <span className="relative inline-flex rounded-full text-sm">👻</span>
        )}
      </span>
      <p className="text-sm font-medium">{title}</p>
      <span className="p-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 ml-1">
        <X size={14} onClick={() => onClose(id)} />
      </span>
    </Button>
  );
};

export const Header = () => {
  const appWindow = getCurrentWebviewWindow();
  const isSidebarOpen = useSnapshot(sidebarState).isSidebarOpen;
  const { tiles, selectedTile } = useSnapshot(headerState);

  const selectTile = useSelectTile();

  return (
    <div className="flex h-12" data-tauri-drag-region>
      <div
        className={clsx('px-4 flex items-center w-[300px] shrink-0', {
          'w-auto mr-4': !isSidebarOpen,
        })}
        data-tauri-drag-region
      >
        <div className="flex items-center gap-2 group mr-8" data-tauri-drag-region>
          <div
            className="w-[14px] h-[14px] rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 ease-out text-black border bg-red-400 border-red-500"
            onClick={() => appWindow.close()}
          >
            <X
              size={8}
              strokeWidth={4}
              className="invisible opacity-0 transition-[visibility,opacity] duration-300 group-hover:visible group-hover:opacity-100 translate-y-0"
            />
          </div>
          <div
            className="w-[14px] h-[14px] rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 ease-out text-black border bg-amber-400 border-amber-500"
            onClick={() => appWindow.minimize()}
          >
            <Minus
              size={8}
              strokeWidth={4}
              className="invisible opacity-0 transition-[visibility,opacity] duration-300 group-hover:visible group-hover:opacity-100 translate-y-0"
            />
          </div>
          <div
            className="w-[14px] h-[14px] rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 ease-out text-black border bg-green-400 border-green-500"
            onClick={() => appWindow.maximize()}
          >
            <Maximize2
              size={8}
              strokeWidth={3}
              className="invisible opacity-0 transition-[visibility,opacity] duration-300 group-hover:visible group-hover:opacity-100 translate-y-0"
            />
          </div>

          <Tooltip
            placement="top"
            content="You are currently on the latest version"
            hoverDuration={400}
            trigger={
              <div
                className="w-[14px] h-[14px] rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 ease-out text-black border bg-blue-400 border-blue-500"
                // onClick={() => navigate(0)}
              >
                <RefreshCcw
                  size={8}
                  strokeWidth={3}
                  className="invisible opacity-0 transition-[visibility,opacity] duration-300 group-hover:visible group-hover:opacity-100 translate-y-0"
                />
              </div>
            }
          />
        </div>
        <Tooltip
          shortcuts={['⌘', 'D']}
          key="sidebar-toggle"
          leaveDuration={0}
          hoverDuration={700}
          trigger={
            <button
              className="flex items-center hover:bg-stone-100 rounded-lg p-2"
              onClick={() => toggleSidebarState()}
            >
              <PanelRight size={18} />
            </button>
          }
          content={isSidebarOpen ? 'Close sidebar' : 'Open in sidebar'}
        />
      </div>

      <div className="py-1 px-2 items-center justify-center flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-stone-300 dark:scrollbar-thumb-stone-700 scrollbar-track-transparent relative">
        {/* <div
          className="absolute right-0 top-0 h-full w-8"
          style={{
            maskImage: 'linear-gradient(to bottom, black calc(100% - 40px), transparent 100%)',
          }}
        /> */}
        {tiles.map((tile) => (
          <SelectedTile
            key={tile.title}
            id={tile.id}
            title={tile.title}
            type={tile.type}
            onClose={(id) => {
              removeTile(id);
            }}
            isActive={tile.id === selectedTile?.id}
            onClick={() => {
              selectTile(tile.id);
            }}
          />
        ))}
      </div>
    </div>
  );
};
