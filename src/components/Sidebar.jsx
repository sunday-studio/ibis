import { Fragment, useState } from 'react';
import { useAppStore } from './AppContext';
import { Plus, Text, Bomb } from 'lucide-react';
import Modal from './Modal';

const truncate = (value) => (value.length >= 40 ? `${value.slice(0, 29)}...` : value);

export const Sidebar = () => {
  const { entries, selectEntry, activeEntry, addNewEntry, deleteEntry } = useAppStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [id, setId] = useState(null);

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
        <div className="header">
          <p className="title">Notes</p>
          <div className="icon" onClick={addNewEntry}>
            <Plus size={16} strokeWidth={2.75} color="#fc521f" />
          </div>
        </div>
        <div className="entries">
          {entries.map((entry) => {
            const isActive = entry?.id === activeEntry?.id;
            return (
              <Fragment key={entry.id}>
                <div
                  className={`entry ${isActive ? 'active-entry' : ''}`}
                  onClick={() => selectEntry(entry)}
                >
                  <div className="icon">
                    <Text
                      size={16}
                      strokeWidth={2.5}
                      color={isActive ? '#fc521f' : '#6b7280'}
                    />
                  </div>

                  <p className="entry-title">{truncate(entry.title) || 'Untitled'}</p>

                  <div
                    className="icon delete"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowDeleteModal(true);
                      setId(entry.id);
                    }}
                  >
                    <Bomb
                      strokeWidth={2.5}
                      size={16}
                      color={isActive ? '#fc521f' : '#6b7280'}
                    />
                  </div>
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
    </>
  );
};
