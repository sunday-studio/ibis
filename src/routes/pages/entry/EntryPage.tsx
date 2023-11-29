import { observer } from 'mobx-react-lite';

import { Editor } from '../../../components/editor/Editor';
import { entriesStore } from '../../../store/entries';

const EntryPage = observer(() => {
  const { activeEntry } = entriesStore;

  const content =
    activeEntry && JSON.parse(activeEntry?.content)?.root?.children.length > 0
      ? JSON.parse(activeEntry?.content)
      : null;

  return (
    <div className="entry-page">
      {activeEntry && <Editor id={activeEntry.id} content={content} />}
    </div>
  );
});

export default EntryPage;
