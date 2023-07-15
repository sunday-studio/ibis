import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';

export default function Root() {
  return (
    <>
      <div className="page-container">
        <div className="two-column-container">
          <div className="sidebar-container">
            <Sidebar />
          </div>
          <Outlet />
          {/* <div className="editor-container">
          {activeEntry && (
            <Editor
              id={activeEntry.id}
              content={activeEntry?.content ? JSON.parse(activeEntry.content) : null}
            />
          )}
        </div> */}
        </div>
      </div>
    </>
  );
}
