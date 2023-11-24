import { loadAllEntries } from '@/lib/data-engine/syncing-helpers';
import { appState } from '@/store/app-state';
import { searchStore } from '@/store/search';
import { Command } from 'cmdk';
import {
  BadgePlus,
  Library,
  LucideIcon,
  MonitorDown,
  Palette,
  Search,
  Settings,
  Sparkles,
} from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

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
      name: 'Open Settings',
      onClick: () => {
        navigate('/settings');
      },
      icon: Settings,
    },

    {
      name: `Toggle ${appState.theme === 'night' ? 'light' : 'night'} mode`,
      onClick: () => {
        appState.toggleTheme(appState.theme === 'night' ? 'light' : 'night');
      },
      icon: Palette,
    },

    {
      name: 'Sync data locally',
      onClick: () => {
        // loadAllEntries();
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
        <Command.Input className="geist-mono-font" placeholder="Search through everyone on Opps" />
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
