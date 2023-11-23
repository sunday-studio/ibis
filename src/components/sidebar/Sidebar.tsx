import { useEffect } from 'react';

import { searchStore } from '@/store/search';
import clsx from 'clsx';
import { BadgePlus, DoorOpen, Search, Sparkles, Trash2Icon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

import { entriesStore } from '../../store/entries';
import { SidebarEntry } from './SidebarEntry';
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
      <div className="icon">{Icon && <Icon size={16} strokeWidth={2.5} />}</div>
      <p className="route-text satoshi-font">{title}</p>
    </div>
  );
};

export const Sidebar = observer(() => {
  const navigate = useNavigate();

  useEffect(() => {
    entriesStore.load();
  }, []);

  function goToPage(route: string) {
    entriesStore.removeActiveEntry();
    navigate(route);
  }

  return (
    <>
      <div className="sidebar">
        <SidebarHeader />
        <div className="sidebar-content">
          <div className="section header-section">
            <RouteLink
              title="Today"
              icon={DoorOpen}
              onClick={() => {
                goToPage('/today');
              }}
            />
            <RouteLink title="Highlights" icon={Sparkles} onClick={() => {}} />
            <RouteLink
              title="Search"
              icon={Search}
              onClick={() => searchStore.toggleSearchModal()}
            />
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

        <div className={clsx('sidebar-entries', {})}>
          {Boolean(entriesStore.pinnedEntriesId.length) && (
            <div className="section">
              <div className="header">
                <p className="title cabinet-font">Pinned</p>
              </div>

              <div className="entries">
                {entriesStore?.pinnedEntries?.map((entry) => {
                  return (
                    <SidebarEntry
                      selectEntry={(entry) => {
                        navigate(`/entry/${entry.id}`);
                        entriesStore.selectEntry(entry);
                      }}
                      entry={entry}
                      activeEntry={entriesStore.activeEntry}
                      key={entry.id}
                      onDelete={() => {
                        entriesStore.deleteEntry(entry.id);
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {entriesStore?.privateEntries.length > 0 && (
            <div className="section">
              <div className="header">
                <p className="title satoshi-font">Private</p>
                <div
                  className="icon"
                  onClick={() => {
                    const id = entriesStore.addNewEntry();
                    navigate(`/entry/${id}`);
                  }}
                >
                  {/* <Plus size={16} /> */}
                </div>
              </div>
              <div className="entries">
                {entriesStore?.privateEntries?.map((entry) => {
                  return (
                    <SidebarEntry
                      selectEntry={(entry) => {
                        navigate(`/entry/${entry.id}`);
                        entriesStore.selectEntry(entry);
                      }}
                      entry={entry}
                      activeEntry={entriesStore.activeEntry}
                      key={entry.id}
                      onDelete={() => {
                        entriesStore.deleteEntry(entry.id);
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* <div className="sidebar-footer">
          <UserTile />
        </div> */}
      </div>
    </>
  );
});
