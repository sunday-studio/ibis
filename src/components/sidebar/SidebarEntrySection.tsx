import { ReactNode } from 'react';

import { Entry } from '@/store/entries';
import { Reorder, useMotionValue } from 'framer-motion';
import { Plus } from 'lucide-react';
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

  return (
    <div className="section">
      <div className="header">
        <p className="title favorit-font">{sectionTitle}</p>
        {actions?.newEntry && (
          <div
            className="icon"
            onClick={() => {
              const id = entriesStore.addNewEntry();
              navigate(`/entry/${id}`);
            }}
          >
            <Plus size={16} />
          </div>
        )}
      </div>
      <div className="entries">
        <Reorder.Group
          axis="y"
          values={entriesStore?.privateEntries}
          onReorder={entriesStore.onReorder}
        >
          {entries.map((entry) => {
            return (
              <EntryWrapper entry={entry} key={entry.id}>
                <SidebarEntry
                  selectEntry={(entry: Entry) => {
                    navigate(`/entry/${entry.id}`);
                    entriesStore.selectEntry(entry);
                  }}
                  entry={entry}
                  activeEntry={entriesStore.activeEntry}
                  key={entry.id}
                  onDelete={() => {
                    entriesStore.deleteEntry(entry.id);
                  }}
                />
              </EntryWrapper>
            );
          })}
        </Reorder.Group>
      </div>
    </div>
  );
};
