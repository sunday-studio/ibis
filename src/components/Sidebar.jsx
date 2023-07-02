import { Fragment } from 'react';
import { useAppStore } from './AppContext';
import { FilePlus } from 'lucide-react';

export const Sidebar = () => {
  const { entries, selectEntry } = useAppStore();

  return (
    <div className="sidebar">
      <div className="header">
        <p className="title"> Notes </p>
        <div className="icon">
          <FilePlus size={18} />
        </div>
      </div>

      <div className="entries">
        {entries.map((entry, index) => {
          return (
            <Fragment key={entry.id}>
              <div className="entry" onClick={() => selectEntry(entry)}>
                <p className="entry-title">{entry.title}</p>
              </div>
              {entries.length - 1 !== index && <div className="divider" />}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};
