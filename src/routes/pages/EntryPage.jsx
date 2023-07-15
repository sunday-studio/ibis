import { useAppStore } from '../../components/AppContext';
import { Editor } from '../../components/Editor';

export default function EntryPage() {
  const { activeEntry } = useAppStore();

  return (
    <div className="editor-container">
      {activeEntry && (
        <Editor
          id={activeEntry.id}
          content={activeEntry?.content ? JSON.parse(activeEntry.content) : null}
        />
      )}
    </div>
  );
}
