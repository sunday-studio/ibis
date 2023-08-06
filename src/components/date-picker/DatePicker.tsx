import { FunctionComponent, useState } from 'react';

import clsx from 'clsx';
import { addMonths, format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { InCurrentMonth, getHeaderDays, getWeeksInMonth, isSameDate } from './date-utils';

type DatePickerProps = {
  size?: 'small' | 'default';
  selectedDate?: string | Date;
  onChange: (date: Date) => void;
};

export const DatePicker: FunctionComponent<DatePickerProps> = ({
  size = 'default',
  selectedDate = new Date(),
  onChange,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date(selectedDate));
  const [weeksToRender, setWeeksToRender] = useState(new Date(selectedDate));

  const weeksInMonth = getWeeksInMonth(weeksToRender);
  const headerValues = getHeaderDays();

  return (
    <div className="datepicker-container">
      <div className="datepicker-container__header">
        <div className="date-details">
          <button onClick={() => setWeeksToRender(addMonths(currentDate, -1))}>
            <ChevronLeft fontSize={20} width={20} height={20} fontWeight={100} />
          </button>

          <p className="datestamp">{format(weeksToRender, 'MMMM, y')}</p>
          <button onClick={() => setWeeksToRender(addMonths(currentDate, 1))}>
            <ChevronRight />
          </button>
        </div>
        <div className="days">
          {headerValues.map((day, index: number) => {
            return (
              <div key={index} className="day">
                {day}
              </div>
            );
          })}
        </div>
      </div>

      <div className="calendar">
        {weeksInMonth?.map((week: any[], index: number) => {
          return (
            <div
              className={clsx('week-container', {
                'is-last-week': weeksInMonth?.length - 1 === index,
              })}
              key={index}
            >
              {week.map((day: Date, index: number) => {
                const isInMonth = InCurrentMonth({ date: day, monthDate: weeksToRender });
                const isToday = isSameDate(new Date(), day);
                const isSelectedDay = isSameDate(currentDate, day);

                return (
                  <div
                    className={clsx('day-container', {
                      'is-selected-day': isSelectedDay,
                      'is-first-day': index === 0,
                      'is-today': isToday,
                      'out-of-month': !isInMonth,
                    })}
                    onClick={() => {
                      setCurrentDate(day);
                      // onChange(day);
                    }}
                    tabIndex={1}
                    key={index}
                  >
                    <p>{format(new Date(day), 'dd')}</p>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
