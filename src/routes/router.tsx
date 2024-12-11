import { createBrowserRouter, Outlet } from 'react-router-dom';

import { AppErrorBoundary } from '@/components/shared/ErrorBoundary';

import Root from './Root';
import AppLayout from './layout/AppLayout';
import EntryPage from './pages/entry/Entry.page';
import JournalPage from './pages/journal/Journal.page';
import { SafeLoadout } from './pages/safe/SafeLoadout.page';
import SettingsPage from './pages/settings/Settings.page';
import TrashPage from './pages/trash/Trash.page';

const NewLayout = () => {
  return (
    <div>
      hello world
      <Outlet />
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    ErrorBoundary: AppErrorBoundary,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/',
            element: <JournalPage />,
          },
          {
            path: '/today',
            element: <JournalPage />,
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
