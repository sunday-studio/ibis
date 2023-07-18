import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AnimatePresence, Reorder, useMotionValue } from 'framer-motion';
import {
  DoorOpen,
  Inbox,
  Plus,
  Search,
  Settings,
  BadgePlus,
  Trash2Icon,
  Sun,
  MoonStar,
  Orbit,
  PanelRightOpen,
} from 'lucide-react';
import { observer } from 'mobx-react-lite';
import * as Popover from '@radix-ui/react-popover';

import { useRaisedShadow } from '../hooks/useRaisedShadow';
import { entriesStore } from '../store/entries';
import { SidebarEntry } from './SidebarEntry';
import { appState } from '../store/app-state';

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

  useEffect(() => {
    entriesStore.load();
  }, []);

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
          <RouteLink title="Today" icon={DoorOpen} />
          {/* <RouteLink title="Search" icon={Search} /> */}
          {/* <RouteLink title="Inbox" icon={Inbox} /> */}
          <RouteLink title="Settings" icon={Settings} />
          <RouteLink title="Trash" icon={Trash2Icon} />
          <RouteLink title="New Entry" icon={BadgePlus} />
        </div>

        {Boolean(entriesStore.pinnedEntriesId.length) && (
          <div className="section">
            <div className="header">
              <p className="title">Pinned</p>
            </div>

            <div className="entries">
              <Reorder.Group
                axis="y"
                values={entriesStore.pinnedEntries}
                onReorder={entriesStore.onReorder}
              >
                {entriesStore?.pinnedEntries?.map((entry) => {
                  return (
                    <EntryWrapper entry={entry} key={entry.id}>
                      <SidebarEntry
                        selectEntry={(entry) => {
                          navigate(`/entry/${entry.id}`);
                          entriesStore.selectEntry(entry);
                        }}
                        entry={entry}
                        activeEntry={entriesStore.activeEntry}
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
            <p className="title">Private</p>

            <div className="icon" onClick={() => entriesStore.addNewEntry()}>
              <Plus size={16} />
            </div>
          </div>
          <div className="entries">
            <Reorder.Group
              axis="y"
              values={entriesStore?.privateEntries}
              onReorder={entriesStore.onReorder}
            >
              {entriesStore?.privateEntries?.map((entry) => {
                return (
                  <EntryWrapper entry={entry} key={entry.id}>
                    <SidebarEntry
                      selectEntry={(entry) => {
                        navigate(`/entry/${entry.id}`);
                        entriesStore.selectEntry(entry);
                      }}
                      entry={entry}
                      activeEntry={entriesStore.activeEntry}
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

        <div className="sidebar-footer">
          <p className="version">version 0.01 ✨</p>

          <Popover.Root>
            <Popover.Trigger asChild>
              <div className="theme-toggle">
                <p className="">{appState.theme}</p>
              </div>
            </Popover.Trigger>

            <Popover.Portal>
              <Popover.Content className="theme-menu PopoverContent" sideOffset={5}>
                <div className="theme-menu-options">
                  <div className="option" onClick={() => appState.toggleTheme('light')}>
                    <div className="option-icon">
                      <Sun size={16} />
                    </div>
                    <p>Light</p>
                  </div>

                  <div className="option" onClick={() => appState.toggleTheme('night')}>
                    <div className="option-icon">
                      <MoonStar size={16} />
                    </div>
                    <p>Night</p>
                  </div>

                  <div className="option" onClick={() => appState.toggleTheme('system')}>
                    <div className="option-icon">
                      <Orbit size={16} />
                    </div>
                    <p>System</p>
                  </div>
                </div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </div>
    </>
  );
});
