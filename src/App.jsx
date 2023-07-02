import { useState, useEffect, Fragment } from 'react';
import { getData, setData } from './lib/storage.js';
import { nanoid } from 'nanoid';
import { format } from 'date-fns';

import { Editor } from './components/Editor.jsx';
import { useAppStore } from './components/AppContext.jsx';

import './toolbar.css';
import './fonts.css';
import { Sidebar } from './components/Sidebar.jsx';

const CONTENT_KEY = 'opps-content';

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
            content={activeEntry?.content ? JSON.parse(activeEntry.content) : null}
          />
        )}
      </div>
    </div>
  );
}

export default App;
