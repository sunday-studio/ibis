import { useEffect, useState } from 'react';

import * as Popover from '@radix-ui/react-popover';
import { Reorder, useMotionValue } from 'framer-motion';
import {
  BadgePlus,
  DoorOpen,
  MoonStar,
  Orbit,
  PanelRightOpen,
  Plus,
  Sun,
  Trash2Icon,
} from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

import { useRaisedShadow } from '../hooks/useRaisedShadow';
import { appState } from '../store/app-state';
import { entriesStore } from '../store/entries';
import Modal from './Modal';
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

const RouteLink = ({ onClick, title, icon: Icon }) => {
  return (
    <div className="route" onClick={onClick}>
      <div className="icon">{Icon && <Icon color="#6b7280" size={16} strokeWidth={2.5} />}</div>
      <p className="route-text">{title}</p>
    </div>
  );
};

export const Sidebar = observer(() => {
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [id, setId] = useState(null);

  useEffect(() => {
    entriesStore.load();
  }, []);

  function goToPage(route) {
    entriesStore.removeActiveEntry();
    navigate(route);
  }

  function closeDeleteModal() {
    setShowDeleteModal(false);
    setId(null);
  }

  return (
    <>
      {showDeleteModal && id && (
        <Modal
          isDialog
          closeOnClickOutside={() => closeDeleteModal()}
          title="Delete entry"
          onClose={() => closeDeleteModal()}
          className="delete-entry-content"
        >
          <p className="description">Are you sure you wanna delete this entry? </p>
          <div className="modal__footer">
            <button
              className="button"
              onClick={() => {
                closeDeleteModal();
              }}
            >
              Cancel
            </button>
            <button
              className="delete-button button"
              onClick={() => {
                entriesStore.deleteEntry(id);
                setShowDeleteModal(false);
              }}
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
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

        {Boolean(entriesStore.pinnedEntriesId.length) && (
          <div className="section">
            <div className="header">
              <p className="title favorit-font">Pinned</p>
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
            <p className="title favorit-font">Private</p>
            <div
              className="icon"
              onClick={() => {
                const id = entriesStore.addNewEntry();
                navigate(`/entry/${id}`);
              }}
            >
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
          <p className="version favorit-font">version {APP_VERSION} ✨</p>

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
