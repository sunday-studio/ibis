import * as Popover from '@radix-ui/react-popover';
import { format, isToday } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { dailyEntryState } from '@/store/daily-state';

import { DatePicker } from '../date-picker/DatePicker';
import { DailyNoteEditor } from './DailyNoteEditor';

function getTitle(d: string) {
  if (!d) return '';

  const date = new Date(d);

  const isDateToday = isToday(date);
  return isDateToday ? 'Today' : format(date, 'do LLL, yyy');
}

// TODO: fix later
// app breaks if on today page and reload happens, probably has to do with how the localdata is loaded to the store

const DailyPage = observer(() => {
  const { dailyEntry } = dailyEntryState;

  // console.log({ dailyEntry });

  // return null;

  const title = getTitle(dailyEntry?.date);

  return (
    <Popover.Root>
      <div className="daily-note">
        <div className="section-header">
          <Popover.Trigger asChild>
            <button className="icon" onClick={(e) => e.stopPropagation()}>
              <Calendar className="icon-inner" size={14} strokeWidth={2.3} />
            </button>
          </Popover.Trigger>
          <button className="icon" onClick={() => dailyEntryState.goToPreviousDay()}>
            <ChevronLeft className="icon-inner" size={16} strokeWidth={2.5} />
          </button>
          <button className="icon" onClick={() => dailyEntryState.goToNextDay()}>
            <ChevronRight className="icon-inner" size={16} strokeWidth={2.5} />
          </button>
        </div>

        <div className="note">
          <div className="title">
            <h3 className="active-date favorit-font">{title}</h3>
          </div>

          <div className="note-editor-container">
            {dailyEntry && (
              <DailyNoteEditor
                onChange={(state) => dailyEntryState.saveNoteContent(state)}
                content={
                  dailyEntry.noteContent ? JSON.parse(dailyEntry.noteContent as string) : null
                }
                id={dailyEntry.id}
              />
            )}
          </div>
        </div>
      </div>

      <Popover.Portal>
        <Popover.Content sideOffset={10}>
          <DatePicker
            onChange={(date: Date) => dailyEntryState.goToDate(date)}
            selectedDate={new Date(dailyEntry?.date)}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
});

export default DailyPage;
