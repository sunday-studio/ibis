import { getWeeksInMonth } from '@internationalized/date';
import { useCalendarGrid, useLocale } from 'react-aria';

import { DatePickerDay } from './DatePicker.Day';

export function DatePickerGrid({ state, showDotIndicator, ...props }) {
  let { locale } = useLocale();
  let { gridProps, headerProps, weekDays } = useCalendarGrid({ ...props }, state);

  let weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale);

  return (
    <table {...gridProps}>
      <thead {...headerProps}>
        <tr>
          {weekDays.map((day, index) => (
            <th key={index}>{day}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <tr key={weekIndex}>
            {state
              .getDatesInWeek(weekIndex)
              .map((date: Date, i: number) =>
                date ? (
                  <DatePickerDay
                    showDotIndicator={showDotIndicator}
                    key={i}
                    state={state}
                    date={date}
                  />
                ) : (
                  <td key={i} />
                ),
              )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
