import { observer } from 'mobx-react-lite';
import { Editor } from '../../components/Editor';
import { entriesStore } from '../../store/entries';

const EntryPage = observer(() => {
  const { activeEntry } = entriesStore;

  return (
    <>
      {activeEntry && (
        <Editor
          id={activeEntry.id}
          content={activeEntry?.content ? JSON.parse(activeEntry.content) : null}
        />
      )}
    </>
  );
});

export default EntryPage;
