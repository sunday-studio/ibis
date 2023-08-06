import { dailyEntryState } from '@/store/daily-state';
import { format, isToday } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { DailyNoteEditor } from './DailyNoteEditor';

function getTitle(date: Date) {
  const isDateToday = isToday(date);
  return isDateToday ? 'Today' : format(date, 'do LLL, yyy');
}

const DailyPage = observer(() => {
  const { dailyEntry } = dailyEntryState;

  if (!dailyEntry?.date) return null;

  const title = getTitle(new Date(dailyEntry?.date));

  return (
    <div className="daily-note">
      <div className="section-header">
        <button className="icon">
          <Calendar size={14} strokeWidth={2.3} />
        </button>
        <button className="icon" onClick={() => dailyEntryState.goToPreviousDay()}>
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>
        <button className="icon" onClick={() => dailyEntryState.goToNextDay()}>
          <ChevronRight size={16} strokeWidth={2.5} />
        </button>
        <button>
          <MoreHorizontal size={16} strokeWidth={2.3} />
        </button>
      </div>

      <div className="note">
        <div className="title">
          <h3 className="active-date">{title}</h3>
        </div>

        <div className="note-editor-container">
          {dailyEntry && (
            <DailyNoteEditor
              onChange={(state) => dailyEntryState.saveNoteContent(state)}
              content={JSON.parse(dailyEntry.noteContent)}
              id={dailyEntry.id}
            />
          )}
        </div>
      </div>
    </div>
  );
});

export default DailyPage;
