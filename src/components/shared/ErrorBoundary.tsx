import { observer } from 'mobx-react-lite';
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';

import { SAFE_LOCATION_KEY } from '@/lib/constants';
import { clearData } from '@/lib/storage';
import { entriesStore } from '@/store/entries';

const AppErrorPage = observer(() => {
  const navigate = useNavigate();

  const reload = () => {
    navigate('/today');

    // TODO: figure out when to actually close the safe and reload
    clearData(SAFE_LOCATION_KEY);

    entriesStore.removeActiveEntry();

    // doing this to cause a reload, not sure why going to /today doesn't cause the rerendering
    navigate(0);
  };

  return (
    <div data-tauri-drag-region className="error-page">
      <div className="error-message">
        <p>Some error happened. Don't worry, it's not you, it's me. We will get right to it.</p>
        <button onClick={() => reload()} className="satoshi-font">
          Reload
        </button>
      </div>
    </div>
  );
});

export function AppErrorBoundary({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary fallback={<AppErrorPage />}>{children}</ErrorBoundary>;
}
