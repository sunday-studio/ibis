import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

import { AppErrorBoundary } from '@/components/shared/ErrorBoundary';

const Root = observer(() => {
  return (
    <>
      <AppErrorBoundary>
        <Toaster richColors />
        <Outlet />
      </AppErrorBoundary>
    </>
  );
});

export default Root;
