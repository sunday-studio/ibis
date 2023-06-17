import { useState, useEffect } from 'react';
import { getData, setData } from './lib/storage.js';

import { Editor } from './components/Editor.jsx';

import './App.css';

const EmptyState = () => {
  return (
    <div className="full-center">
      <h4>Hello Cas</h4>
      <p>Welcome to your new petty nightmare</p>
      <button>Add new entry</button>
    </div>
  );
};

function App() {
  const [content, setContent] = useState([]);

  useEffect(() => {
    const data = getData('content') ?? [];

    setContent(data);
  }, []);

  // if (content?.length <= 0) {
  //   return (
  //     <div className="empty-state-container">
  //       <EmptyState />
  //     </div>
  //   );
  // }

  return (
    <div className="container">
      <Editor />
    </div>
  );
}

export default App;
