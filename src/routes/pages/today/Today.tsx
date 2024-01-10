import DailyNote from '../../../components/daily-notes/Note';

export default function TodayPage() {
  return (
    <div className="container today-page">
      <div className="notes">
        <DailyNote />
      </div>
    </div>
  );
}
