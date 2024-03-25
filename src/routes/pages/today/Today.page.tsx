import { AppErrorBoundary } from '@/components/shared/ErrorBoundary';

import DailyNote from '../../../components/daily-notes/Note';

export default function TodayPage() {
  return (
    <div className="container today-page">
      <AppErrorBoundary>
        <DailyNote />
      </AppErrorBoundary>
    </div>
  );
}
