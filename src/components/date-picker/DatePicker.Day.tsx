import React from 'react';

import { getLocalTimeZone, isSameDay, today } from '@internationalized/date';
import clsx from 'clsx';
import { useCalendarCell } from 'react-aria';

export function DatePickerDay({ state, date, showDotIndicator: showDotIndicatorFn }) {
  let ref = React.useRef(null);
  let now = today(getLocalTimeZone());
  const isToday = isSameDay(now, date);

  const showDotIndicator = showDotIndicatorFn?.(new Date(date)) || false;

  let { cellProps, buttonProps, isSelected, isOutsideVisibleRange, isDisabled, formattedDate } =
    useCalendarCell({ date }, state, ref);

  return (
    <td {...cellProps}>
      <div
        {...buttonProps}
        ref={ref}
        // hidden={isOutsideVisibleRange}
        className={clsx('cell', {
          selected: isSelected,
          disabled: isDisabled,
          today: isToday,
          outsideVisibleRange: isOutsideVisibleRange,
        })}
      >
        <div className="date">{formattedDate}</div>
        <div
          className="dot-indicator"
          style={{
            visibility: showDotIndicator ? 'visible' : 'hidden',
          }}
        >
          •
        </div>
      </div>
    </td>
  );
}
