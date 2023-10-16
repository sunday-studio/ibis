import DailyCalendar from '../../components/daily-notes/Calendar';
import DailyNote from '../../components/daily-notes/Note';
import DailyTodos from '../../components/daily-notes/Todos';

export default function TodayPage() {
  return (
    <div className="container today-page">
      <div className="notes">
        <DailyNote />
      </div>
      {/* <div className="sider">
        <div className="todos">
          <DailyTodos />
        </div>
        <div className="calendar">
          <DailyCalendar />
        </div>
      </div> */}
    </div>
  );
}
