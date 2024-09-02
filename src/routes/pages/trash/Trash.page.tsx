import { observer } from 'mobx-react-lite';

import { Entry, entriesStore } from '@/store/entries';

const TrashPage = observer(() => {
  const { deletedEntries: entries } = entriesStore;

  const deletedEntries = entries.filter(Boolean) as Entry[];

  return (
    <div className="trash-page page">
      <div className="deleted-entries">
        {deletedEntries.map((entry: Entry) => {
          return (
            <div className="entry" key={entry.id}>
              <p className="title">{entry.title || 'Untitled'}</p>
              <button onClick={() => entriesStore.restoreEntry(entry.id)}>Restore</button>
              <button
                className="delete-button"
                onClick={() => entriesStore.permanentDelete(entry.id)}
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default TrashPage;
