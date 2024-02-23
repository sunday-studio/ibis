import { useState } from 'react';

import { observer } from 'mobx-react-lite';

import { type Folder, entriesStore } from '@/store/entries';

interface SidebarFolder {
  folderId: string;
}

export const SidebarFolder = observer<SidebarFolder>(({ folderId }) => {
  const [open, toggleOpen] = useState(true);

  const folder: Folder = entriesStore.folders[folderId];
  const entries = folder.entries.map((entryId) =>
    entriesStore.entries.find((entry) => entry.id === entryId),
  );

  return (
    <div className="sidebar-folder" onClick={() => toggleOpen(!open)}>
      <p>{folder.name}</p>
      {open && (
        <ul>
          {entries.map((entry) => {
            return <li key={entry.id}>{entry.title}</li>;
          })}
        </ul>
      )}
    </div>
  );
});
