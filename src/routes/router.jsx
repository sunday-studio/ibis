import * as React from 'react';

import { createBrowserRouter } from 'react-router-dom';

import Root from './Root';
import EntryPage from './pages/EntryPage';
import Today from './pages/Today';
import TrashPage from './pages/TrashPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <Today />,
      },
      {
        path: '/today',
        element: <Today />,
      },

      {
        path: '/entry/:noteId',
        element: <EntryPage />,
      },

      {
        path: '/trash',
        element: <TrashPage />,
      },
    ],
  },
]);
