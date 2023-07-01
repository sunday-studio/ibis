import { useState, useEffect, Fragment } from 'react';
import { getData, setData } from './lib/storage.js';
import { nanoid } from 'nanoid';
import { format } from 'date-fns';

import { Editor } from './components/Editor.jsx';

import './toolbar.css';
import './fonts.css';

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

const ContentListItem = ({ title, createdAt, onClick, onDelete }) => {
  return (
    <div className="contentlist-item" onClick={onClick}>
      <p className="title">{title}</p>
      <div className="createdAt">{format(new Date(createdAt), 'd MMM, yyyy - p')}</div>
      <button
        className="delete-btn shadow-button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        Delete
      </button>
    </div>
  );
};

function App() {
  const [content, setContent] = useState([]);
  const [currentContentState, setCurrentContentState] = useState(null);

  useEffect(() => {
    const data = getData(CONTENT_KEY) ?? [];
    setContent(data);
  }, []);

  const saveEditedContent = (editorState) => {
    const firstTextChild =
      editorState?.root?.children?.[0]?.children?.[0]?.text ?? new Date().toISOString();

    const entry = {
      ...currentContentState,
      updatedAt: new Date().toISOString(),
      content: JSON.stringify(editorState),
      title: firstTextChild,
    };

    const updatedContent = [
      entry,
      ...content.filter((item) => item.id !== currentContentState.id),
    ];

    setData(CONTENT_KEY, updatedContent);
    setContent(updatedContent);
  };

  const saveContent = (editorState) => {
    // designated as an edit if currentContentState.id exist
    if (currentContentState.id) {
      saveEditedContent(editorState);
      return;
    }

    const firstTextChild =
      editorState?.root?.children?.[0]?.children?.[0]?.text ?? new Date().toISOString();
    const entry = {
      id: nanoid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      content: JSON.stringify(editorState),
      title: firstTextChild,
    };

    const updatedContent = [entry, ...content];

    setData(CONTENT_KEY, updatedContent);
    setContent(updatedContent);
  };

  const deleteListing = (id) => {
    const updatedContent = content.filter((item) => item?.id !== id);
    setData(CONTENT_KEY, updatedContent);
    setContent(updatedContent);
  };

  const addNewEntry = () => {
    setCurrentContentState({
      content: '',
      createdAt: new Date().toISOString(),
    });
  };

  if (currentContentState) {
    return (
      <div className="container">
        <Editor
          onBackClick={() => setCurrentContentState(null)}
          saveContent={saveContent}
          lastEditDate={currentContentState?.updatedAt ?? currentContentState?.createdAt}
          content={
            currentContentState?.content ? JSON.parse(currentContentState.content) : null
          }
        />
      </div>
    );
  }

  if (content?.length <= 0) {
    return (
      <div className="empty-state-container">
        <EmptyState addNewEntry={addNewEntry} />
      </div>
    );
  }

  if (content.length > 0) {
    return (
      <div className="container contentlist-container">
        <div className="header">
          <h2>All list</h2>
          <button className="shadow-button" onClick={addNewEntry}>
            New Entry
          </button>
        </div>
        {content.map((content, index) => {
          return (
            <Fragment key={content.id}>
              <ContentListItem
                onClick={() => setCurrentContentState(content)}
                title={content.title}
                createdAt={content?.createdAt}
                onDelete={() => deleteListing(content.id)}
              />
              {content.length - 1 !== index && <div className="hr-divider" />}
            </Fragment>
          );
        })}
      </div>
    );
  }
}

export default App;
