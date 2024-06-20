import { ChangeEvent, useState } from 'react';

import { observer } from 'mobx-react-lite';
import { nanoid } from 'nanoid';

import { type Folder, entriesStore } from '@/store/entries';

interface FolderMenu {
  entryId: string;
  onFolderSelect: () => void;
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

  const hasNoFolders = folders.length <= 0 && !Boolean(inputValue.length);
  const showCreateButton = filteredFolders.length >= 0 && inputValue.length > 0;

  return (
    <div className="folder-menu">
      <div className="search-input">
        <input
          placeholder="Search for folders"
          autoFocus
          value={inputValue}
          onChange={handleInputChange}
        />
      </div>
      <ul>
        {hasNoFolders && (
          <li className="folder-empty">No folders yet. Search to create your first one.</li>
        )}

        {filteredFolders?.length > 0 && (
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
        )}

        {showCreateButton && (
          <button
            onClick={() => {
              entriesStore.addFolder(
                {
                  id: nanoid(),
                  name: inputValue,
                  entries: new Set([entryId]),
                },
                entryId,
              );

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
