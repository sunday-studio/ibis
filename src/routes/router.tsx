import { checkIfLoggedIn } from '@/lib/auth/auth-helpers';
import AppLayout from '@/routes/layout/AppLayout';
import { createBrowserRouter } from 'react-router-dom';

import Root from './Root';
import TrashPage from './pages/TrashPage';
import AuthPage from './pages/auth/Auth';
import EntryPage from './pages/entry/EntryPage';
import SettingsPage from './pages/settings/Settings';
import Today from './pages/today/Today';

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
        path: '/settings',
        element: <SettingsPage />,
      },

      {
        path: '/auth',
        element: <AuthPage />,
      },
    ],
  },
]);
