import { Fragment } from 'react';
import { useAppStore } from './AppContext';
import { Plus, Text } from 'lucide-react';

export const Sidebar = () => {
  const { entries, selectEntry, activeEntry, addNewEntry } = useAppStore();

  return (
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
                <p className="entry-title">{entry.title}</p>
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};
