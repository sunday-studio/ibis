import * as React from 'react';

import { createBrowserRouter } from 'react-router-dom';
import Today from './pages/Today';
import EntryPage from './pages/EntryPage';
import Root from './Root';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/today',
        element: <Today />,
      },

      {
        path: '/entry/:noteId',
        element: <EntryPage />,
      },
    ],
  },
]);
