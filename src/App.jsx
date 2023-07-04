import { Editor } from './components/Editor.jsx';
import { useAppStore } from './components/AppContext.jsx';

import './editor.css';
import './fonts.css';
import { Sidebar } from './components/Sidebar.jsx';

const EmptyState = ({ addNewEntry }) => {
  return (
    <div className="full-center">
      <h4>Hello</h4>
      <p>Welcome to your new petty nightmare</p>
      <button onClick={addNewEntry} className="shadow-button">
        Add new entry
      </button>
    </div>
  );
};

function App() {
  const { entries, activeEntry } = useAppStore();

  if (entries?.length <= 0) {
    return (
      <div className="empty-state-container">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="two-column-container">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="editor-container">
        {activeEntry && (
          <Editor
            id={activeEntry.id}
            content={activeEntry?.content ? JSON.parse(activeEntry.content) : null}
          />
        )}
      </div>
    </div>
  );
}

export default App;
