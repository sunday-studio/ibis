import { Fragment, useMemo, useRef, useState } from 'react';

import * as ContextMenu from '@radix-ui/react-context-menu';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { BadgePlus, ChevronRight, FolderPen, Trash2 } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

import { Entry, type Folder, entriesStore } from '@/store/entries';

import Modal from '../modal/Modal';
import { Tooltip } from '../tooltip/Tooltip';
import { SidebarEntry } from './SidebarEntry';

type FolderWithoutEntries = Pick<Folder, 'name' | 'id'>;

interface SidebarFolder {
  entries: Entry[];
  folder?: FolderWithoutEntries;
  open?: boolean;
  isSystemFolder?: boolean;
}

const FolderDeletionModal = ({
  onClose,
  folder,
  entryCount,
}: {
  entryCount: string;
  folder: FolderWithoutEntries;
  onClose: () => void;
}) => {
  return (
    <Modal
      title="Delete Folder"
      onClose={onClose}
      closeOnClickOutside
      className="folder-deletion-modal"
      isDialog
    >
      <p>
        Are you sure you want to delete <b>{folder?.name}</b>
      </p>
      <p>
        You currently have <b>{entryCount}</b> in this folder.
      </p>

      <div className="actions">
        <Tooltip
          content="This will delete the folder and all entries in it"
          trigger={
            <button
              onClick={() => {
                entriesStore.deleteFolder(folder.id, 'WITH-ENTRIES');
              }}
              className="unstyled delete"
            >
              Delete
            </button>
          }
        />
        <Tooltip
          content="This will only delete the folder and return all the entries to private"
          trigger={
            <button
              onClick={() => {
                entriesStore.deleteFolder(folder.id, 'WITHOUT-ENTRIES');
              }}
              className="unstyled soft-delete"
            >
              Delete folder only
            </button>
          }
        />
        <button className="unstyled cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export const SidebarFolder = observer<SidebarFolder>(
  ({ open: openByDefault = false, folder, entries, isSystemFolder = false }) => {
    const [open, toggleOpen] = useState(openByDefault);
    const [folderName, setFolderName] = useState(folder.name);
    const [isEditingFolderName, setIsEditingFolderName] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);

    const entryCount =
      entries.length > 1
        ? `${entries.length} entries`
        : entries.length === 0
        ? 'No entries'
        : '1 entry';

    return (
      <>
        {showDeleteModal && (
          <FolderDeletionModal
            folder={folder}
            entryCount={entryCount}
            onClose={() => setShowDeleteModal(false)}
          />
        )}
        <ContextMenu.Root>
          <div className="sidebar-folder" onClick={() => toggleOpen(!open)}>
            <ContextMenu.Trigger>
              <Tooltip
                placement="right"
                hoverDuration={600}
                trigger={
                  <div
                    className="folder disabled-selection"
                    data-editing={isEditingFolderName ? 'true' : 'false'}
                  >
                    <div
                      className={clsx('folder-icon', {
                        'folder-icon_open': open,
                      })}
                    >
                      <ChevronRight size={20} strokeWidth={2.3} />
                    </div>
                    <input
                      type="text"
                      autoFocus
                      style={{
                        display: isEditingFolderName ? 'flex' : 'none',
                      }}
                      className="folder-name-input"
                      value={folderName}
                      onChange={(e) => setFolderName(e.target.value)}
                      onKeyUp={(e) => {
                        if (e.key === 'Enter') {
                          entriesStore.renamedFolder(folder.id, folderName);
                          setIsEditingFolderName(false);
                        }
                      }}
                      onBlur={() => {
                        entriesStore.renamedFolder(folder.id, folderName);
                        setIsEditingFolderName(false);
                      }}
                      onFocus={(e) => e.target.select()}
                      ref={inputRef}
                    />
                    <p
                      style={{
                        display: !isEditingFolderName ? 'flex' : 'none',
                      }}
                    >
                      {folderName}
                    </p>
                  </div>
                }
                content={entryCount}
              />
            </ContextMenu.Trigger>

            <AnimatePresence initial={openByDefault}>
              {open && (
                <ul>
                  {entries.map((entry) => {
                    return (
                      <motion.div
                        initial={{ height: 0 }}
                        key={entry.id}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ type: 'spring', duration: 0.2, bounce: 0 }}
                      >
                        <SidebarEntry
                          entry={entry}
                          activeEntry={entriesStore.activeEntry}
                          selectEntry={(entry) => {
                            entriesStore.selectEntry(entry);
                            navigate(`/entry/${entry.id}`);
                          }}
                        />
                      </motion.div>
                    );
                  })}
                </ul>
              )}
            </AnimatePresence>
          </div>

          <ContextMenu.Portal>
            <ContextMenu.Content className="popover-content popover-container" alignOffset={5}>
              <FolderContextMenu
                onDelete={() => {
                  setShowDeleteModal(true);
                }}
                isSystemFolder={isSystemFolder}
                onRename={() => {
                  setIsEditingFolderName(true);
                  setTimeout(() => {
                    inputRef.current.focus();
                  }, 50);
                }}
                folder={folder}
              />
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>
      </>
    );
  },
);

const FolderContextMenu = ({
  folder,
  onRename,
  isSystemFolder,
  onDelete,
}: {
  onRename: () => void;
  onDelete: () => void;
  folder: Pick<Folder, 'name' | 'id'>;
  isSystemFolder: boolean;
}) => {
  const navigate = useNavigate();

  const options = useMemo(() => {
    return [
      {
        disabled: false,
        action: () => {
          const entryId = entriesStore.addNewEntry();
          if (folder.name.toLowerCase() === 'pinned') {
            entriesStore.updatePinned({
              id: entryId,
              type: 'ADD',
            });

            navigate(`/entry/${entryId}`);
            return;
          }

          entriesStore.addEntryToFolder(folder.id, entryId);
          navigate(`/entry/${entryId}`);
        },
        icon: <BadgePlus size={16} />,
        title: 'Add new entry',
      },

      {
        action: onRename,
        disabled: isSystemFolder,
        icon: <FolderPen size={16} />,
        title: 'Rename',
      },
      {
        action: onDelete,
        disabled: isSystemFolder,
        icon: <Trash2 size={16} />,
        title: 'Delete',
      },
    ];
  }, [folder]);

  return (
    <Fragment>
      <div style={{ padding: 5 }}>
        {options.map((option, index) => {
          return (
            <ContextMenu.Item
              className="option"
              key={index}
              disabled={option?.disabled}
              onClick={(e) => {
                e.stopPropagation();
                option.action();
              }}
            >
              <div className="option-icon">{option.icon}</div>
              <p>{option.title}</p>
            </ContextMenu.Item>
          );
        })}
      </div>
    </Fragment>
  );
};
