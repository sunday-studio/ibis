import { useState, useMemo } from 'react';

import { AnimatePresence, Reorder, useMotionValue } from 'framer-motion';
import { Plus, Search, DoorOpen, Inbox, Settings } from 'lucide-react';

import { useRaisedShadow } from '../hooks/useRaisedShadow';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from './AppContext';
// import Modal from './Modal';
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
      <div className="icon">
        {Icon && <Icon color="#6b7280" size={16} strokeWidth={2.5} />}
      </div>
      <p className="route-text">{title}</p>
    </div>
  );
};

export const Sidebar = () => {
  const {
    entries,
    selectEntry,
    activeEntry,
    addNewEntry,
    deleteEntry,
    favorites,
    onReorder,
  } = useAppStore();

  const navigate = useNavigate();
  // const [showDeleteModal, setShowDeleteModal] = useState(false);
  // const [id, setId] = useState(null);

  // const favoriteEntries = useMemo(() => {
  //   return entries.filter((entry) => favorites.includes(entry.id));
  // }, [favorites, entries, activeEntry]);

  const notes = useMemo(() => {
    return entries.filter((entry) => !favorites.includes(entry.id));
  }, [favorites, entries, activeEntry]);

  return (
    <>
      {/* {showDeleteModal && id && (
        <Modal title="" onClose={() => setShowDeleteModal(false)}>
          <p>Are you sure you wanna delete this entry? </p>
          <button
            className="save-button button"
            onClick={() => {
              deleteEntry(id);
              setShowDeleteModal(false);
            }}
          >
            Delete
          </button>
        </Modal>
      )} */}
      <div className="sidebar">
        <div className="section header-section">
          <RouteLink title="Today" icon={DoorOpen} />
          <RouteLink title="Search" icon={Search} />
          <RouteLink title="Inbox" icon={Inbox} />
          <RouteLink title="Settings" icon={Settings} />
        </div>

        <div className="section">
          <div className="header">
            <p className="title">Pinned</p>
          </div>
        </div>

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
            <Reorder.Group axis="y" values={notes} onReorder={onReorder}>
              {notes.map((entry) => {
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
};
