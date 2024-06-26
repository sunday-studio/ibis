import { Command } from 'cmdk';
import {
  BadgePlus,
  Library,
  LucideIcon,
  MonitorDown,
  Palette,
  RefreshCcwDot,
  Search,
  Sparkles,
} from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

import { SAFE_LOCATION_KEY } from '@/lib/constants';
import { loadDirectoryContent } from '@/lib/data-engine/syncing-helpers';
import { clearData, getData } from '@/lib/storage';
import { runMigration } from '@/migrations/file-date-pattern.migrate';
import { appState } from '@/store/app-state';
import { searchStore } from '@/store/search';

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

  const defaultActions: ActionProps[] = [
    // {
    //   name: 'Run Migrations',
    //   onClick: () => {
    //     runMigration();
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

    {
      name: 'New Highlight',
      onClick: () => {
        navigate('/highlight');
      },
      icon: Sparkles,
    },
    {
      name: 'New Journal log',
      onClick: () => {
        navigate('/today');
      },
      icon: Library,
    },

    {
      name: `Toggle ${appState.theme === 'night' ? 'light' : 'night'} mode`,
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
        navigate(0);
      },
      icon: MonitorDown,
    },
  ];

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
        <Command.Input className="geist-mono-font" placeholder="Search through everyone on Ibis" />
      </div>
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
