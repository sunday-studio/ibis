import { createBrowserRouter } from 'react-router-dom';

import { checkIfLoggedIn } from '@/lib/auth/auth-helpers';
import AppLayout from '@/routes/layout/AppLayout';

// import AuthPage from './pages/auth/Auth';
import Root from './Root';
import { Onboarding } from './pages/auth/Onboarding.Page';
import EntryPage from './pages/entry/Entry.Page';
import SettingsPage from './pages/settings/Settings.Page';
import Today from './pages/today/Today.Page';
import TrashPage from './pages/trash/Trash.Page';

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
        element: <Onboarding />,
      },
    ],
  },
]);
