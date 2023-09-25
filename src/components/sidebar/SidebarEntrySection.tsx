import { ReactNode, useMemo, useState } from 'react';

import { Entry } from '@/store/entries';
import clsx from 'clsx';
import { Reorder, useMotionValue } from 'framer-motion';
import { ArrowDown, CornerDownRight, MoveDown, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useRaisedShadow } from '../../hooks/useRaisedShadow';
import { entriesStore } from '../../store/entries';
import { SidebarEntry } from './SidebarEntry';

type SidebarSectionProps = {
  sectionTitle: string;
  entries: Entry[];
  actions: {
    newEntry: boolean;
    newFolder: boolean;
  };
};

interface EntryWrapperProps {
  entry: Entry;
  children: ReactNode;
}

const EntryWrapper: React.FC<EntryWrapperProps> = ({ entry, children }) => {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);

  return (
    <Reorder.Item value={entry} key={entry.id} style={{ boxShadow, y, borderRadius: 6 }}>
      {children}
    </Reorder.Item>
  );
};

export const SidebarEntrySection: React.FC<SidebarSectionProps> = ({
  actions = {
    newEntry: true,
    newFolder: true,
  },
  entries,
  sectionTitle,
}) => {
  const navigate = useNavigate();

  const [show, setShow] = useState(false);

  return (
    <div className="">
      <div className="folder">
        <div className="folder-item" onClick={() => setShow((prev) => !prev)}>
          <div className="icon">
            {show ? <ArrowDown size={12} /> : <CornerDownRight size={12} />}
          </div>
          <p className="folder-item__title">Folder {sectionTitle}</p>
        </div>

        <div
          className={clsx('folder-entries', {
            'folder-entries__open': show,
          })}
        >
          {entries.map((entry, index) => (
            <div
              className={clsx('entry', {
                entry__before: entries.length - 1 !== index,
              })}
              key={index}
            >
              <p>{entry.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// export { SidebarEntrySection: useMemo(SidebarEntrySection)}
