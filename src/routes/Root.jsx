import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

const Root = observer(() => {
  return (
    <>
      <Toaster richColors />
      <Outlet />
    </>
  );
});

export default Root;
