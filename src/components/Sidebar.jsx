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
      <div className="sidebar"></div>
    </>
  );
};
