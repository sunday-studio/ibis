import * as React from 'react';

import { checkIfLoggedIn } from '@/lib/auth/auth-helpers';
import AppLayout from '@/routes/layout/AppLayout';
import { createBrowserRouter } from 'react-router-dom';

import Root from './Root';
import EntryPage from './pages/EntryPage';
import Today from './pages/Today';
import TrashPage from './pages/TrashPage';
import AuthPage from './pages/auth/Auth';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        element: <AppLayout />,
        loader: checkIfLoggedIn,
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
      {
        path: '/auth',
        element: <AuthPage />,
      },
    ],
  },
]);
