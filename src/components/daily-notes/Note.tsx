import { useEffect } from 'react';

import * as Popover from '@radix-ui/react-popover';
import clsx from 'clsx';
import { format, isToday } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { entryHasValidContent, getDayPercentageCompleted } from '@/lib/utils';
import { dailyEntryState } from '@/store/daily-state';

import { DatePicker } from '../date-picker/DatePicker';
import { EDITOR_PAGES, Editor } from '../editor/Editor';

function getDateValues(d: string) {
  if (!d) return {};

  const date = new Date(d);

  return {
    dateNumber: format(date, 'dd'),
    day: format(date, 'EEEE'),
    month: format(date, 'MMMM'),
    year: format(date, 'uuuu'),
    isToday: isToday(date),
  };
}

const DailyPage = observer(() => {
  const { dailyEntry } = dailyEntryState;

  const dateValues = getDateValues(dailyEntry?.date);

  const updatePercentageCompleted = () => {
    const dayCompleted = getDayPercentageCompleted();
    let root = document.documentElement;
    root.style.setProperty('--percentage-completed', `${dayCompleted}%`);
  };

  useEffect(() => {
    updatePercentageCompleted();
    const intervalId = setInterval(() => {
      updatePercentageCompleted();
    }, 45 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [dateValues.day]);

  return (
    <Popover.Root>
      <div className="daily-note">
        <div className="daily-note__header">
          <div className="note-date">
            <h1
              className={clsx({
                'is-today': dateValues.isToday,
              })}
            >
              {dateValues.dateNumber}
            </h1>
            <div className="date-data">
              <p className="day">{dateValues?.day}</p>
              <p className="month">{dateValues?.month}</p>
              <p className="year">{dateValues?.year}</p>
            </div>
          </div>

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
        </div>

        <div className="note">
          <div className="note-editor-container">
            {dailyEntry && (
              <Editor
                page={EDITOR_PAGES.JOURNAL}
                placeholderClassName="daily-note-placeholder"
                onChange={(state) => dailyEntryState.saveNoteContent(state)}
                content={
                  entryHasValidContent(dailyEntry.noteContent)
                    ? JSON.parse(dailyEntry.noteContent as string)
                    : null
                }
                id={dailyEntry.id}
              />
            )}
          </div>
        </div>
      </div>

      <Popover.Portal>
        <Popover.Content sideOffset={10} data-align="left" alignOffset={10} align="start">
          <DatePicker
            onChange={(date: Date) => dailyEntryState.goToDate(date)}
            value={dailyEntry?.date}
            showDotIndicator={(date: Date) => dailyEntryState.showDotIndicator(date)}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
});

export default DailyPage;
