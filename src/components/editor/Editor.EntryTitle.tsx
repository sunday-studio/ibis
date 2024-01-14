import { ChangeEvent, useState } from 'react';

import { observer } from 'mobx-react-lite';

import { entriesStore } from '@/store/entries';

export const EntryTitle = observer(() => {
  const entryStore = entriesStore;
  const { activeEntry } = entryStore;

  const [inputValue, setInputValue] = useState(activeEntry!.title);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    entryStore.updateActiveEntireTitle(value);
  };

  return (
    <div className="entry-input">
      <input type="text" onChange={handleInputChange} value={inputValue} />
    </div>
  );
});
