import { useCallback, useMemo } from 'react';

import clsx from 'clsx';
import { BadgePlus, DoorOpen, Search, Trash2Icon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

import { dailyEntryState } from '@/store/daily-state';
import { searchStore } from '@/store/search';

import { type Entry, type Folder, entriesStore } from '../../store/entries';
import { SidebarEntry } from './SidebarEntry';
import { SidebarFolder } from './SidebarFolder';
import { SidebarHeader } from './SidebarHeader';

const RouteLink = ({
  onClick,
  title,
  icon: Icon,
}: {
  onClick: () => void;
  title: string;
  icon: any;
}) => {
  return (
    <div className="route" onClick={onClick}>
      <div className="icon">
        {Icon && <Icon className="icon-inner" size={16} strokeWidth={2.5} />}
      </div>
      <p className="route-text">{title}</p>
    </div>
  );
};

export const Sidebar = observer(() => {
  const navigate = useNavigate();

  function goToPage(route: string) {
    entriesStore.removeActiveEntry();
    navigate(route);
  }

  const pinnedEntries = useMemo(() => {
    return entriesStore?.pinnedEntries.sort((a: Entry, b: Entry) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [entriesStore?.pinnedEntries]);

  const privateEntries = useMemo(() => {
    return entriesStore?.privateEntries.sort((a: Entry, b: Entry) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [entriesStore.privateEntries]);

  const folders = useMemo(() => {
    return entriesStore.foldersWithEntries;
  }, [entriesStore.foldersWithEntries]);

  return (
    <div className="sidebar">
      <SidebarHeader />
      <div className="sidebar-content">
        <div className="sidebar-routes">
          <RouteLink
            title="Today"
            icon={DoorOpen}
            onClick={() => {
              dailyEntryState.goToToday();
              goToPage('/today');
            }}
          />
          {/* <RouteLink title="Highlights" icon={Sparkles} onClick={() => {}} /> */}
          <RouteLink title="Search" icon={Search} onClick={() => searchStore.toggleSearchModal()} />
          <RouteLink title="Trash" icon={Trash2Icon} onClick={() => goToPage('/trash')} />
          <RouteLink
            title="New Entry"
            icon={BadgePlus}
            onClick={() => {
              const entryId = entriesStore.addNewEntry();
              navigate(`/entry/${entryId}`);
            }}
          />
        </div>
      </div>

      <div className={clsx('sidebar-entries')}>
        <div className="sidebar-folders">
          <SidebarFolder open folder={{ name: 'Pinned' }} entries={pinnedEntries} />
          {folders?.map((folder) => {
            return <SidebarFolder folder={folder.folder} entries={folder.entries} />;
          })}
        </div>

        {privateEntries.length > 0 && (
          <div className="section">
            <div className="header">
              <p className="title">Private</p>
              <div
                className="icon"
                onClick={() => {
                  const id = entriesStore.addNewEntry();
                  navigate(`/entry/${id}`);
                }}
              />
            </div>
            <div className="entries">
              {privateEntries?.map((entry) => {
                return (
                  <SidebarEntry
                    selectEntry={(entry) => {
                      navigate(`/entry/${entry.id}`);
                      entriesStore.selectEntry(entry);
                    }}
                    entry={entry}
                    activeEntry={entriesStore.activeEntry}
                    key={entry.id}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
