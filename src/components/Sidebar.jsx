import { Fragment, useState } from 'react';
import { useAppStore } from './AppContext';
import {
  Plus,
  Text,
  MoreHorizontal,
  Trash2,
  Crown,
  Package,
  BadgeInfo,
  SquareStack,
} from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { AnimatePresence, motion, useIsPresent } from 'framer-motion';
import * as ContextMenu from '@radix-ui/react-context-menu';
import Modal from './Modal';
import { useMemo } from 'react';
import format from 'date-fns/format';
import { toast } from 'sonner';

const truncate = (value) => (value.length >= 40 ? `${value.slice(0, 29)}...` : value);

const Entry = ({ entry, activeEntry, selectEntry, onDelete }) => {
  const isActive = entry?.id === activeEntry?.id;
  const isPresent = useIsPresent();

  const animations = {
    style: {
      position: isPresent ? 'static' : 'absolute',
    },
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: { type: 'linear', duration: 0.1 },
  };

  return (
    <Popover.Root key={entry.id}>
      <ContextMenu.Root>
        <ContextMenu.Trigger asChild>
          <motion.div
            {...animations}
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
            <Popover.Trigger asChild>
              <div
                className="icon more-options"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <MoreHorizontal
                  strokeWidth={2.5}
                  size={18}
                  color={isActive ? '#fc521f' : '#6b7280'}
                />
              </div>
            </Popover.Trigger>

            <Popover.Portal>
              <Popover.Content className="PopoverContent" sideOffset={5}>
                <MoreOptions entry={entry} onDelete={onDelete} />
              </Popover.Content>
            </Popover.Portal>
          </motion.div>
        </ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content className="PopoverContent" sideOffset={5} align="end">
            <MoreOptions entry={entry} onDelete={onDelete} />
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>
    </Popover.Root>
  );
};

const MoreOptions = ({ entry, onDelete }) => {
  const { favorites, updateFavories } = useAppStore();

  const isFavorite = favorites.includes(entry.id);
  const options = useMemo(() => {
    return [
      {
        title: 'Delete',
        action: () => onDelete(),
        icon: <Trash2 size={16} />,
      },

      {
        title: 'Duplicate',
        action: () => {},
        icon: <SquareStack size={16} />,
      },

      {
        title: isFavorite ? 'Remove from Favs' : 'Add to Favs',
        action: () =>
          updateFavories({
            id: entry.id,
            type: isFavorite ? 'REMOVE' : 'ADD',
          }),
        icon: <Crown size={16} />,
      },

      {
        title: 'Archive',
        action: () => toast('Note removed'),
        icon: <Package size={16} />,
      },

      {
        title: 'Info',
        action: () => {},
        icon: <BadgeInfo size={16} />,
      },
    ];
  }, [favorites]);
  return (
    <Fragment>
      {options.map((option, index) => {
        return (
          <div
            className="option"
            onClick={(e) => {
              option.action();
              e.stopPropagation();
            }}
            key={index}
          >
            <div className="option-icon">{option.icon}</div>
            <p>{option.title}</p>
          </div>
        );
      })}

      <div className="hr-divider" />
      <div className="entry-details">
        <p>Created on: {format(new Date(entry.createdAt), 'dd, MMMM yyy')}</p>

        {entry.updatedAt && (
          <p>Last edited on: {format(new Date(entry.createdAt), 'dd, MMM yy, h:m a')} </p>
        )}
      </div>
    </Fragment>
  );
};

export const Sidebar = () => {
  const { entries, selectEntry, activeEntry, addNewEntry, deleteEntry, favorites } =
    useAppStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [id, setId] = useState(null);

  const favoriteEntries = useMemo(() => {
    return entries.filter((entry) => favorites.includes(entry.id));
  }, [favorites, entries]);

  const notes = useMemo(() => {
    return entries.filter((entry) => !favorites.includes(entry.id));
  }, [favorites, entries]);

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
                <p className="title">Favorites</p>
              </div>
              <div className="entries">
                {favoriteEntries.map((entry) => {
                  return (
                    <Entry
                      selectEntry={selectEntry}
                      entry={entry}
                      activeEntry={activeEntry}
                      key={entry.id}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </AnimatePresence>

        <div className="section">
          <div className="header">
            <p className="title">Notes</p>
            <div className="icon" onClick={addNewEntry}>
              <Plus size={16} strokeWidth={2.75} color="#fc521f" />
            </div>
          </div>
          <div className="entries">
            {notes.map((entry) => {
              return (
                <Entry
                  selectEntry={selectEntry}
                  entry={entry}
                  activeEntry={activeEntry}
                  key={entry.id}
                  onDelete={() => {
                    setId(entry.id);
                    setShowDeleteModal(true);
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
