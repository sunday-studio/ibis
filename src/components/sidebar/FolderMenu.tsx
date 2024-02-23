import { ChangeEvent, useState } from 'react';

import { observer } from 'mobx-react-lite';
import { nanoid } from 'nanoid';

import { type Folder, entriesStore } from '@/store/entries';

interface FolderMenu {
  entryId: string;
  onFolderSelect: () => {};
}

export const FolderMenu = observer<FolderMenu>(({ entryId, onFolderSelect }) => {
  const folders: Array<Folder> = Object.values(entriesStore.folders);

  const [inputValue, setInputValue] = useState('');
  const [filteredFolders, setFilteredFolders] = useState(folders);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setFilteredFolders(
      folders.filter((folder) =>
        folder.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()),
      ),
    );

    setInputValue(value);
  };

  return (
    <div className="folder-menu">
      <input placeholder="Search for folders" value={inputValue} onChange={handleInputChange} />
      <ul>
        {filteredFolders?.length > 0 ? (
          <>
            {filteredFolders.map((folder: Folder) => {
              return (
                <li
                  onClick={() => entriesStore.addEntryToFolder(folder.id, entryId)}
                  key={folder.id}
                >
                  {folder.name}
                </li>
              );
            })}
          </>
        ) : (
          <button
            onClick={() => {
              entriesStore.addFolder({
                id: nanoid(),
                name: inputValue,
                entries: [entryId],
              });

              onFolderSelect();
            }}
          >
            Create <b>{inputValue}</b> folder
          </button>
        )}
      </ul>
    </div>
  );
});
