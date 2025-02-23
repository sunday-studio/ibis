import { Command } from 'cmdk';
import {
  BadgePlus,
  Construction,
  Library,
  LucideIcon,
  MonitorDown,
  RefreshCcwDot,
  Search,
} from 'lucide-react';
import { useSnapshot } from 'valtio';

import {
  commandDialogState,
  editorModeState,
  setSidebarState,
  toggleCommandDialogState,
  toggleFocusModeState,
} from '@/app.store';

type ActionProps = {
  name: string;
  onClick: () => void;
  icon: LucideIcon;
};

const ActionItem = (props: ActionProps) => {
  const { name, onClick, icon: Icon } = props;
  return (
    <Command.Item className="action" onSelect={onClick}>
      <div className="action-icon">{<Icon size={18} />}</div>
      <p className="action-name">{name}</p>
    </Command.Item>
  );
};

export const CommandDialog = () => {
  const showCommandModal = useSnapshot(commandDialogState).isCommandDialogOpen;
  const isFocusModeActive = useSnapshot(editorModeState).isFocusMode;

  const defaultActions: ActionProps[] = [
    {
      name: 'New Entry',
      onClick: () => {},
      icon: BadgePlus,
    },

    {
      name: 'New Journal log',
      onClick: () => {},
      icon: Library,
    },

    {
      name: `Turn ${isFocusModeActive ? 'off' : 'on'} focus mode`,
      onClick: () => {
        toggleFocusModeState();

        if (!isFocusModeActive) {
          setSidebarState(false);
        }
      },
      icon: Construction,
    },
  ];

  const handleSearch = (term: string) => {
    console.log(term);
    // const response = searchEngine.search(`${term}-1`);
    // setResults(response);
  };

  // const showSearchResults = results.length > 0;

  return (
    <Command.Dialog
      open={showCommandModal}
      onOpenChange={() => toggleCommandDialogState()}
      className="
      animate-contentShow
      fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen max-w-[550px] 
      max-h-[85vh] z-[4] p-1 
      bg-stone-200 dark:bg-neutral-900 rounded-xl border-0 backdrop-blur-[20px] backdrop-saturate-[190%] backdrop-contrast-[70%] backdrop-brightness-[80%]
      "
    >
      <div className="flex items-center justify-center px-2 rounded-lg">
        <div className="flex items-center justify-center">
          <Search size={15} strokeWidth={3} className="text-stone-900 dark:text-stone-400" />
        </div>
        <Command.Input
          onValueChange={handleSearch}
          placeholder="Search through everyone on Ibis"
          className="w-full"
        />
      </div>

      {/* <div className="search">
        {showSearchResults &&
          results.map((result) => {
            return <div className="search-results">{result.title}</div>;
          })}
      </div> */}

      <Command.List>
        <Command.Empty>No results found.</Command.Empty>
        <Command.Group heading="Actions">
          {defaultActions.map((action: ActionProps, index) => {
            return (
              <ActionItem
                {...action}
                key={index}
                onClick={() => {
                  action.onClick();
                  toggleCommandDialogState();
                }}
              />
            );
          })}
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
};
