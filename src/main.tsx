// @ts-nocheck
import React from 'react';

import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { router } from './routes/router';
// styles
// import './styles/_reset.scss';
import './styles/_base.scss';
import './styles/editor.scss';
import './styles/fonts.scss';
import './styles/styles.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>,
);
