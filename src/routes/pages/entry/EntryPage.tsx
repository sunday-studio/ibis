import { observer } from 'mobx-react-lite';

import { Editor } from '../../../components/editor/Editor';
import { entriesStore } from '../../../store/entries';

const EntryPage = observer(() => {
  const { activeEntry } = entriesStore;

  return (
    <div className="entry-page">
      {activeEntry && (
        <Editor
          id={activeEntry.id}
          content={activeEntry?.content ? JSON.parse(activeEntry.content) : null}
        />
      )}
    </div>
  );
});

export default EntryPage;
