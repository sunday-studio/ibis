import { observer } from 'mobx-react-lite';

import { EDITOR_PAGES, Editor, EntryHeader } from '../../../components/editor/Editor';
import { entriesStore } from '../../../store/entries';

const EntryPage = observer(() => {
  const { activeEntry } = entriesStore;

  const content =
    activeEntry && JSON.parse(activeEntry?.content)?.root?.children.length > 0
      ? JSON.parse(activeEntry?.content)
      : null;

  return (
    <div className="entry-page">
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
