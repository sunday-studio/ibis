import { useState } from 'react';

import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight, FolderIcon, FolderOpen } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

import { type Folder, entriesStore } from '@/store/entries';

import { SidebarEntry } from './SidebarEntry';

interface SidebarFolder {
  folderId: string;
}

export const SidebarFolder = observer<SidebarFolder>(({ folderId }) => {
  const [open, toggleOpen] = useState(false);
  const navigate = useNavigate();

  const folder: Folder = entriesStore.folders[folderId];
  const entries = [...folder.entries].map((entryId) =>
    entriesStore.entries.find((entry) => entry.id === entryId),
  );

  return (
    <div className="sidebar-folder" onClick={() => toggleOpen(!open)}>
      <div className="folder">
        <div
          className={clsx('folder-icon', {
            'folder-icon_open': open,
          })}
        >
          <ChevronRight size={20} strokeWidth={2.3} />
        </div>
        <p>{folder.name}</p>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <ul>
            {entries.map((entry) => {
              return (
                <motion.div
                  initial={{ height: 0 }}
                  key={entry.id}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
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
  );
});
