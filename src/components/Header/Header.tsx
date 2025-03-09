import { FC } from 'react';

import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import clsx from 'clsx';
import { Maximize2, Minus, PanelRight, RefreshCcw, X } from 'lucide-react';
import { useSnapshot } from 'valtio';

import { sidebarState, toggleSidebarState } from '@/app.store';
import { EmojiRenderer } from '@/features/notes/NoteIconPicker';

import { Tooltip } from '../Tooltip';
import { type HeaderTile, headerState, useRemoveTile, useSelectTile } from './header.store';

interface SelectedTileProps extends HeaderTile {
  onClose: (tileId: string) => void;
  isActive?: boolean;
  onClick: (tileId: string) => void;
}

const WindowActions = () => {
  const appWindow = getCurrentWebviewWindow();
  const isSidebarOpen = useSnapshot(sidebarState).isSidebarOpen;

  return (
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
            <div className="w-[14px] h-[14px] rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 ease-out text-black border bg-blue-400 border-blue-500">
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
            className="flex items-center hover:bg-stone-100 rounded-lg p-2 dark:hover:bg-stone-800"
            onClick={() => toggleSidebarState()}
          >
            <PanelRight size={18} />
          </button>
        }
        content={isSidebarOpen ? 'Close sidebar' : 'Open in sidebar'}
      />
    </div>
  );
};

const HeaderTile: FC<SelectedTileProps> = ({ title, onClose, isActive, id, onClick, icon }) => {
  return (
    <button
      onClick={() => {
        onClick(id);
      }}
      className={clsx('flex gap-1 pl-2 pr-1 py-1 items-center justify-between rounded-xl', {
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
          <div className="w-4 h-4 rounded-full flex items-center justify-center -mt-1">
            <EmojiRenderer emoji={icon} size={12} />
          </div>
        )}
      </span>
      <p className="text-sm font-medium">{title}</p>
      <span
        className="p-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 ml-1"
        onClick={(e) => {
          e.stopPropagation();
          onClose(id);
        }}
      >
        <X size={14} />
      </span>
    </button>
  );
};

export const Header = () => {
  const { tiles, selectedTile } = useSnapshot(headerState);

  const selectTile = useSelectTile();
  const removeTile = useRemoveTile();
  return (
    <div className="flex h-12" data-tauri-drag-region>
      <WindowActions />
      <div
        className="py-1 mx-2 w-full items-center justify-center flex gap-2 relative overflow-hidden"
        data-tauri-drag-region
      >
        <div
          className="absolute left-0 top-0 h-full w-8 bg-stone-100 dark:bg-stone-900 "
          style={{
            maskImage: 'linear-gradient(to right, black calc(100% - 40px), transparent 100%)',
          }}
        />
        <div
          className="absolute right-0 top-0 h-full w-8 bg-stone-100 dark:bg-stone-900 "
          style={{
            maskImage: 'linear-gradient(to left, black calc(100% - 40px), transparent 100%)',
          }}
        />

        <ul
          className="flex w-full overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-stone-300 dark:scrollbar-thumb-stone-700 scrollbar-track-transparent"
          data-tauri-drag-region
        >
          {tiles.map((tile, index) => (
            <HeaderTile
              {...tile}
              key={index}
              onClose={(id) => {
                removeTile(id);
              }}
              isActive={tile.id === selectedTile?.id}
              onClick={() => {
                selectTile(tile.id);
              }}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};
