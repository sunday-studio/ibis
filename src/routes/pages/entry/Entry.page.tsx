import { observer } from 'mobx-react-lite';

import { EDITOR_PAGES, Editor } from '../../../components/editor/Editor';
import { entriesStore } from '../../../store/entries';

const EntryPage = observer(() => {
  const { activeEntry } = entriesStore;

  const content = activeEntry?.content || '';

  return (
    <div className="entry-page">
      {activeEntry && (
        <Editor
          page={EDITOR_PAGES.ENTRY}
          onChange={(state) => {
            const isChange = state !== content;
            if (isChange) entriesStore.saveContent(state);
          }}
          id={activeEntry.id}
          content={content}
        />
      )}
    </div>
  );
});

export default EntryPage;
