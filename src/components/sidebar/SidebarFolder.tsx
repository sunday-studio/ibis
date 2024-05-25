import { Fragment, useMemo, useRef, useState } from 'react';

import * as ContextMenu from '@radix-ui/react-context-menu';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { BadgePlus, ChevronRight, FolderPen, Trash2 } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

import { Entry, type Folder, entriesStore } from '@/store/entries';

import { Tooltip } from '../tooltip/Tooltip';
import { SidebarEntry } from './SidebarEntry';

interface SidebarFolder {
  entries: Entry[];
  folder?: Pick<Folder, 'name' | 'id'>;
  open?: boolean;
}

export const SidebarFolder = observer<SidebarFolder>(
  ({ open: openByDefault = false, folder, entries }) => {
    const [open, toggleOpen] = useState(openByDefault);
    const [folderName, setFolderName] = useState(folder.name);
    const [isEditingFolderName, setIsEditingFolderName] = useState(false);

    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);

    const entryCount =
      entries.length > 1
        ? `${entries.length} entries`
        : entries.length === 0
        ? 'No entries'
        : '1 entry';

    return (
      <ContextMenu.Root>
        <div className="sidebar-folder" onClick={() => toggleOpen(!open)}>
          <ContextMenu.Trigger>
            <Tooltip
              placement="right"
              hoverDuration={600}
              trigger={
                <div className="folder">
                  <div
                    className={clsx('folder-icon', {
                      'folder-icon_open': open,
                    })}
                  >
                    <ChevronRight size={20} strokeWidth={2.3} />
                  </div>
                  <input
                    type="text"
                    style={{
                      display: isEditingFolderName ? 'flex' : 'none',
                    }}
                    className="folder-name-input"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    onBlur={() => setIsEditingFolderName(false)}
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
              onRename={() => {
                setIsEditingFolderName(true);
                inputRef.current.focus();
              }}
              folder={folder}
            />
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>
    );
  },
);

const FolderContextMenu = ({
  folder,
  onRename,
}: {
  onRename: () => void;
  folder: Pick<Folder, 'name' | 'id'>;
}) => {
  const navigate = useNavigate();

  // Add disabled states for Pinned
  const actions = useMemo(() => {
    return [
      {
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
        icon: <FolderPen size={16} />,
        title: 'Rename',
      },
      {
        action: () => {},
        icon: <Trash2 size={16} />,
        title: 'Delete',
      },
    ];
  }, [folder]);

  return (
    <Fragment>
      <div style={{ padding: 5 }}>
        {actions.map((action, index) => {
          return (
            <button
              key={index}
              className="unstyled option"
              onClick={(e) => {
                e.stopPropagation();
                action.action();
              }}
            >
              <div className="option-icon">{action.icon}</div>
              <p>{action.title}</p>
            </button>
          );
        })}
      </div>
    </Fragment>
  );
};
