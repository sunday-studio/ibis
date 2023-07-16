import React from 'react';
import ReactDOM from 'react-dom/client';
import { router } from './routes/router';
import { RouterProvider } from 'react-router-dom';

// styles
// import './styles/_reset.scss';
import './styles/_base.scss';
import './styles/styles.scss';
import './styles/editor.scss';
import './styles/fonts.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>,
);
