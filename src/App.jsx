// import { useAppStore } from './components/AppContext.jsx';
import { Toaster } from 'sonner';

import { Editor } from './components/Editor.jsx';
// import './editor.css';
// import './fonts.css';
import { Sidebar } from './components/Sidebar.jsx';

// const EmptyState = ({ addNewEntry }) => {
//   return (
//     <div className="full-center">
//       <h4>Hello</h4>
//       <p>Welcome to your new petty nightmare</p>
//       <button onClick={addNewEntry} className="shadow-button">
//         Add new entry
//       </button>
//     </div>
//   );
// };

function App() {
  // const { activeEntry } = useAppStore();

  return (
    <>
      {/* <Toaster theme="dark" richColors />
      <div className="page-container">
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
      </div> */}
    </>
  );
}

export default App;
