import { ChangeEvent, useState } from 'react';

import { observer } from 'mobx-react-lite';

import { entriesStore } from '@/store/entries';

// import { TagEditor } from './Editor.TagEditor';

export const EntryTitle = observer(() => {
  const entryStore = entriesStore;
  const { activeEntry } = entryStore;

  const [inputValue, setInputValue] = useState(activeEntry!.title);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    entryStore.updateActiveEntryTitle(value);
  };

  return (
    <div className="entry-input">
      <input type="text" onChange={handleInputChange} value={inputValue} />
    </div>
  );
});

export const EntryHeader = observer(() => {
  return (
    <div className="entry-header">
      <EntryTitle />
      <div className="tags">{/* <TagEditor /> */}</div>
    </div>
  );
});
