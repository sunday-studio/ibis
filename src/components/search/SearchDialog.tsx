import { useState } from 'react';

import { Command } from 'cmdk';
import {
  BadgePlus,
  Construction,
  Library,
  LucideIcon,
  MonitorDown,
  Palette,
  Play,
  RefreshCcwDot,
  Search,
  Sparkles,
} from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router-dom';

import { generateNewDirectory } from '@/lib/auth/auth-helpers';
import { ACTIVE_ENTRY, SAFE_LOCATION_KEY } from '@/lib/constants';
import { loadDirectoryContent } from '@/lib/data-engine/syncing-helpers';
import { searchEngine } from '@/lib/search/search-engine';
import { clearData, getData } from '@/lib/storage';
// import { runMigration } from '@/migrations/file-date-pattern.migrate';
import { appState } from '@/store/app-state';
import { searchStore } from '@/store/search';
import { meili } from '@/lib/data-engine/syncing-engine';

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

export const SearchDialog = observer(() => {
  const { showSearchModal } = searchStore;
  const navigate = useNavigate();
  const [results, setResults] = useState([]);

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
        navigate('/');
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
        navigate('/today');
      },
      icon: Library,
    },

    {
      name: `Toggle ${appState.theme === 'night' ? 'light' : 'dark'} mode`,
      onClick: () => {
        appState.toggleTheme(appState.theme === 'night' ? 'light' : 'night');
      },
      icon: Palette,
    },

    {
      name: 'Reload local data',
      onClick: () => {
        const SAFEURL = getData(SAFE_LOCATION_KEY);
        loadDirectoryContent(SAFEURL);
      },
      icon: RefreshCcwDot,
    },
    {
      name: 'Load new safe',
      onClick: () => {
        clearData(SAFE_LOCATION_KEY);
        clearData(ACTIVE_ENTRY);
        meili.reset();
        navigate('/safe');
      },
      icon: MonitorDown,
    },

    {
      name: 'Toggle zen mode',
      onClick: () => {
        appState.toggleZenMode();
      },
      icon: Construction,
    },
  ];

  const handleSearch = (term: string) => {
    const response = searchEngine.search(`${term}-1`);
    console.log('response =>', response);
    setResults(response);
  };

  const showSearchResults = results.length > 0;

  return (
    <Command.Dialog
      open={showSearchModal}
      onOpenChange={() => searchStore.toggleSearchModal()}
      className="search-dialog"
    >
      <div className="search-input">
        <div className="search-icon">
          <Search size={15} strokeWidth={3} />
        </div>
        <Command.Input
          onValueChange={handleSearch}
          className="geist-mono-font"
          placeholder="Search through everyone on Ibis"
        />
      </div>

      <div className="search">
        {showSearchResults &&
          results.map((result) => {
            return <div className="search-results">{result.title}</div>;
          })}
      </div>

      <Command.List>
        <Command.Empty>No results found.</Command.Empty>
        <Command.Group heading="Actions">
          {!showSearchResults &&
            defaultActions.map((action: ActionProps, index) => {
              return (
                <ActionItem
                  {...action}
                  key={index}
                  onClick={() => {
                    action.onClick();
                    searchStore.toggleSearchModal();
                  }}
                />
              );
            })}
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
});
