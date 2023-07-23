import React from 'react';
import { observer } from 'mobx-react-lite';
import { entriesStore, Entry } from '../../store/entries';

const TrashPage = observer(() => {
  const { deletedEntries } = entriesStore;

  return (
    <div className="trash-page page">
      <div className="deleted-entries">
        {deletedEntries.map((entry: Entry) => {
          return (
            <div className="entry" key={entry.id}>
              <p className="title">{entry.title || 'Untitled'}</p>
              <button onClick={() => entriesStore.restoreEntry(entry.id)}>Restore</button>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default TrashPage;
