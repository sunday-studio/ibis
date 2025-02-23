import { useState } from 'react';

import { Command } from 'cmdk';
import {
  BadgePlus,
  Construction,
  Library,
  LucideIcon,
  MonitorDown,
  Palette,
  RefreshCcwDot,
  Search,
} from 'lucide-react';
import { useSnapshot } from 'valtio';

// import { ACTIVE_ENTRY, SAFE_LOCATION_KEY } from '@/lib/constants';
// import { loadDirectoryContent, resetAppState } from '@/lib/data-engine/syncing-helpers';
// import { searchEngine } from '@/lib/search/search-engine';
// import { clearData, getData } from '@/lib/storage';
// // import { runMigration } from '@/migrations/file-date-pattern.migrate';
// import { appState } from '@/store/app-state';
// import { searchStore } from '@/store/search';
// import { meili } from '@/lib/data-engine/syncing-engine';

import { commandDialogState, toggleCommandDialogState, toggleFocusModeState } from '@/app.store';

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
  // const { showSearchModal } = searchStore;
  // const navigate = useNavigate();
  // const [results, setResults] = useState([]);

  const defaultActions: ActionProps[] = [
    // {
    //   name: 'Run Migrations',
    //   onClick: () => {
    //     generateNewDirectory(`/Users/cas/Desktop/ibis-tests/${nanoid()}`);
    //     // ""
    //   },
    //   icon: Play,
    // },
    {
      name: 'New Entry',
      onClick: () => {
        // navigate('/');
      },
      icon: BadgePlus,
    },

    // {
    //   name: 'New Highlight',
    //   onClick: () => {
    //     navigate('/highlight');
    //   },
    //   icon: Sparkles,
    // },
    {
      name: 'New Journal log',
      onClick: () => {
        // navigate('/today');
      },
      icon: Library,
    },

    // {
    //   name: `Toggle ${appState.theme === 'night' ? 'light' : 'dark'} mode`,
    //   onClick: () => {
    //     appState.toggleTheme(appState.theme === 'night' ? 'light' : 'night');
    //   },
    //   icon: Palette,
    // },

    {
      name: 'Reload local data',
      onClick: () => {
        // const SAFEURL = getData(SAFE_LOCATION_KEY);
        // loadDirectoryContent(SAFEURL);
      },
      icon: RefreshCcwDot,
    },
    {
      name: 'Load new safe',
      onClick: () => {
        // clearData(SAFE_LOCATION_KEY);
        // clearData(ACTIVE_ENTRY);
        // resetAppState();
        // navigate('/safe');
      },
      icon: MonitorDown,
    },

    {
      name: 'Toggle focus mode',
      onClick: () => {
        toggleFocusModeState();
      },
      icon: Construction,
    },
  ];

  const handleSearch = (term: string) => {
    // const response = searchEngine.search(`${term}-1`);
    // setResults(response);
  };

  // const showSearchResults = results.length > 0;

  return (
    <Command.Dialog
      open={showCommandModal}
      onOpenChange={() => toggleCommandDialogState()}
      className="
      fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen max-w-[550px] 
      max-h-[85vh] animate-[contentShow_150ms_cubic-bezier(0.16,1,0.3,0.5)] z-[4] p-1 
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
