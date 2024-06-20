import { observer } from 'mobx-react-lite';

import { EDITOR_PAGES, Editor } from '../../../components/editor/Editor';
import { entriesStore } from '../../../store/entries';
import { useEffect, useRef } from 'react';

const EntryPage = observer(() => {
  const { activeEntry } = entriesStore;
  const ref = useRef<HTMLDivElement>(null);

  const content = activeEntry?.content || '';

  return (
    <div className="entry-page" ref={ref}>
      {activeEntry && (
        <Editor
          page={EDITOR_PAGES.ENTRY}
          onChange={(state) => entriesStore.saveContent(state)}
          id={activeEntry.id}
          content={content}
        />
      )}
    </div>
  );
});

export default EntryPage;
