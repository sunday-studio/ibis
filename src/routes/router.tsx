import { createBrowserRouter } from 'react-router-dom';

import Root from './Root';
import AppLayout from './layout/AppLayout';
import EntryPage from './pages/entry/Entry.page';
import { SafeLoadout } from './pages/safe/SafeLoadout.page';
import SettingsPage from './pages/settings/Settings.page';
import Today from './pages/today/Today.page';
import TrashPage from './pages/trash/Trash.page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        element: <AppLayout />,
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
        path: '/safe',
        element: <SafeLoadout />,
      },
    ],
  },
]);
