import { AppErrorBoundary } from '@/components/shared/ErrorBoundary';

import DailyNote from '../../../components/journal/Note';

export default function JournalPage() {
  return (
    <div className="container journal-page">
      <AppErrorBoundary>
        <DailyNote />
      </AppErrorBoundary>
    </div>
  );
}
