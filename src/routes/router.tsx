import { createBrowserRouter } from 'react-router-dom';

import { checkIfLoggedIn } from '@/lib/auth/auth-helpers';

import Root from './Root';
import AppLayout from './layout/AppLayout';
import { Onboarding } from './pages/auth/Onboarding.page';
import EntryPage from './pages/entry/Entry.page';
import SettingsPage from './pages/settings/Settings.page';
import Today from './pages/today/Today.page';
import TrashPage from './pages/trash/Trash.page';

const Test = () => {
  return (
    <div>
      <p>testing stom</p>
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        element: <AppLayout />,
        // TODO: remove all this auth code
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
