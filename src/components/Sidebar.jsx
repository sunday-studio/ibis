import { useState } from 'react';
import { useMemo } from 'react';

import { AnimatePresence, Reorder, useMotionValue } from 'framer-motion';
import { Plus } from 'lucide-react';

import { useRaisedShadow } from '../hooks/useRaisedShadow';
import { useAppStore } from './AppContext';
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [id, setId] = useState(null);

  const favoriteEntries = useMemo(() => {
    return entries.filter((entry) => favorites.includes(entry.id));
  }, [favorites, entries, activeEntry]);

  const notes = useMemo(() => {
    return entries.filter((entry) => !favorites.includes(entry.id));
  }, [favorites, entries, activeEntry]);

  return (
    <>
      {showDeleteModal && id && (
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
      )}
      <div className="sidebar">
        <AnimatePresence>
          {favoriteEntries.length && (
            <div className="section">
              <div className="header">
                <p className="title">Pinned</p>
              </div>
              <div className="entries">
                <Reorder.Group
                  axis="y"
                  values={notes}
                  // onReorder={onReorder}
                >
                  {favoriteEntries.map((entry) => {
                    return (
                      <EntryWrapper entry={entry} key={entry.id}>
                        <SidebarEntry
                          selectEntry={selectEntry}
                          entry={entry}
                          activeEntry={activeEntry}
                          key={entry.id}
                        />
                      </EntryWrapper>
                    );
                  })}
                </Reorder.Group>
              </div>
            </div>
          )}
        </AnimatePresence>

        <div className="section">
          <div className="header">
            <p className="title">Private notes </p>
            <div className="icon" onClick={addNewEntry}>
              <Plus size={16} strokeWidth={2.75} color="#fc521f" />
            </div>
          </div>
          <div className="entries">
            <Reorder.Group axis="y" values={notes} onReorder={onReorder}>
              {notes.map((entry) => {
                return (
                  <EntryWrapper entry={entry} key={entry.id}>
                    <SidebarEntry
                      selectEntry={selectEntry}
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
