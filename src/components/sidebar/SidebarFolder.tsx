import { useState } from 'react';

import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

import { Entry, type Folder, entriesStore } from '@/store/entries';

import { SidebarEntry } from './SidebarEntry';

interface SidebarFolder {
  entries: Entry[];
  folder?: Pick<Folder, 'name'>;
  open?: boolean;
}

export const SidebarFolder = observer<SidebarFolder>(
  ({ open: openByDefault = false, folder, entries }) => {
    const [open, toggleOpen] = useState(openByDefault);
    const navigate = useNavigate();

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
  },
);
