import { ReactNode, useEffect, useRef, useState } from 'react';

import clsx from 'clsx';
import { BadgePlus, DoorOpen, PanelRightOpen, Trash2Icon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

import { appState } from '../../store/app-state';
import { entriesStore } from '../../store/entries';
import { SidebarEntry } from './SidebarEntry';
import { UserTile } from './UserTile';

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
      <div className="icon">{Icon && <Icon color="#6b7280" size={16} strokeWidth={2.5} />}</div>
      <p className="route-text">{title}</p>
    </div>
  );
};

function useScrollTop() {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollContainerRef = useRef(null);

  const handleScroll = (event: any) => {
    setScrollTop(event.target.scrollTop);
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer) {
      // @ts-ignore
      scrollContainer.addEventListener('scroll', handleScroll);

      return () => {
        // @ts-ignore
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return [scrollTop, { ref: scrollContainerRef }];
}

export const Sidebar = observer(() => {
  const navigate = useNavigate();

  useEffect(() => {
    entriesStore.load();
  }, []);

  function goToPage(route: string) {
    entriesStore.removeActiveEntry();
    navigate(route);
  }

  const [scrollTop, scrollProps] = useScrollTop();

  return (
    <>
      <div className="sidebar">
        <div
          className="sidebar-toggle"
          role="button"
          onClick={() => appState.toggleSidebarOpenState()}
        >
          <PanelRightOpen size={18} />
        </div>

        <div className="section header-section">
          <RouteLink
            title="Today"
            icon={DoorOpen}
            onClick={() => {
              goToPage('/today');
            }}
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

        <div
          className={clsx('sidebar-entries', {
            // @ts-ignore
            'sidebar-entries__withborder': scrollTop > 50,
          })}
          // @ts-ignore
          {...scrollProps}
        >
          {Boolean(entriesStore.pinnedEntriesId.length) && (
            <div className="section">
              <div className="header">
                <p className="title favorit-font">Pinned</p>
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
                <p className="title favorit-font">Private</p>
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

          {/* {Boolean(entriesStore.pinnedEntriesId.length) && (
            <SidebarEntrySection
              entries={entriesStore.pinnedEntries}
              sectionTitle="Private"
              actions={{
                newEntry: false,
                newFolder: false,
              }}
            />
          )} */}

          {/* {privateEntries.map((entry: Entry, index) => {
            return (
              <SidebarEntry
                entry={entry}
                onDelete={() => entriesStore.deleteEntry(entry.id)}
                selectEntry={() => {
                  entriesStore.selectEntry(entry);
                  navigate(`/entry/${entry.id}`);
                }}
                key={index}
              />
            );
          })} */}

          {/* {newSet.map((set, index) => {
            return (
              <SidebarEntrySection key={index} entries={set} sectionTitle={`Private ${index}`} />
            );
          })} */}
        </div>

        <div className="sidebar-footer">
          <UserTile />
        </div>
      </div>
    </>
  );
});
