import { useEffect, useMemo, useState } from 'react';

import { AnimatePresence, Reorder, useMotionValue } from 'framer-motion';
import { DoorOpen, Inbox, Plus, Search, Settings } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

import { useRaisedShadow } from '../hooks/useRaisedShadow';
import { entriesStore } from '../store/entries';
import { SidebarEntry } from './SidebarEntry';

const EntryWrapper = ({ entry, children }) => {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);

  return (
    <Reorder.Item value={entry} key={entry.id} style={{ boxShadow, y, borderRadius: 6 }}>
      {children}
    </Reorder.Item>
  );
};

const RouteLink = ({ link, title, icon: Icon }) => {
  const navigate = useNavigate();
  return (
    <div className="route" onClick={() => navigate('/today')}>
      <div className="icon">{Icon && <Icon color="#6b7280" size={16} strokeWidth={2.5} />}</div>
      <p className="route-text">{title}</p>
    </div>
  );
};

export const Sidebar = observer((props) => {
  const navigate = useNavigate();

  const { entries, selectEntry, activeEntry, addNewEntry, deleteEntry, favorites, onReorder } =
    entriesStore;

  useEffect(() => {
    entriesStore.load();
  }, []);

  return (
    <>
      <div className="sidebar">
        <div className="section header-section">
          <RouteLink title="Today" icon={DoorOpen} />
          <RouteLink title="Search" icon={Search} />
          <RouteLink title="Inbox" icon={Inbox} />
          <RouteLink title="Settings" icon={Settings} />
        </div>

        {Boolean(entriesStore.pinnedEntriesId.length) && (
          <div className="section">
            <div className="header">
              <p className="title">Pinned</p>
            </div>

            <div className="entries">
              <Reorder.Group axis="y" values={entriesStore.pinnedEntries} onReorder={() => {}}>
                {entriesStore?.pinnedEntries?.map((entry) => {
                  return (
                    <EntryWrapper entry={entry} key={entry.id}>
                      <SidebarEntry
                        selectEntry={(entry) => {
                          navigate(`/entry/${entry.id}`);
                          entriesStore.selectEntry(entry);
                        }}
                        entry={entry}
                        activeEntry={activeEntry}
                        key={entry.id}
                        onDelete={() => {
                          setId(entry.id);
                          setShowDeleteModal(true);
                        }}
                      />
                    </EntryWrapper>
                  );
                })}
              </Reorder.Group>
            </div>
          </div>
        )}

        <div className="section">
          <div className="header">
            <p className="title">Shared</p>
          </div>
        </div>

        <div className="section">
          <div className="header">
            <p className="title">Private</p>
          </div>

          <div className="entries">
            <Reorder.Group axis="y" values={entriesStore?.privateEntries} onReorder={() => {}}>
              {entriesStore?.privateEntries?.map((entry) => {
                return (
                  <EntryWrapper entry={entry} key={entry.id}>
                    <SidebarEntry
                      selectEntry={(entry) => {
                        navigate(`/entry/${entry.id}`);
                        selectEntry(entry);
                      }}
                      entry={entry}
                      activeEntry={activeEntry}
                      key={entry.id}
                      onDelete={() => {
                        setId(entry.id);
                        setShowDeleteModal(true);
                      }}
                    />
                  </EntryWrapper>
                );
              })}
            </Reorder.Group>
          </div>
        </div>
      </div>
    </>
  );
});
