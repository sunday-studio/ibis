import React from 'react';

import { getLocalTimeZone, isSameDay, today } from '@internationalized/date';
import clsx from 'clsx';
import { useCalendarCell } from 'react-aria';

export function DatePickerDay({ state, date }) {
  let ref = React.useRef(null);
  let now = today(getLocalTimeZone());
  const isToday = isSameDay(now, date);

  let { cellProps, buttonProps, isSelected, isOutsideVisibleRange, isDisabled, formattedDate } =
    useCalendarCell({ date }, state, ref);

  return (
    <td {...cellProps}>
      <div
        {...buttonProps}
        ref={ref}
        hidden={isOutsideVisibleRange}
        className={clsx('cell', {
          selected: isSelected,
          disabled: isDisabled,
          today: isToday,
          outsideVisibleRange: isOutsideVisibleRange,
        })}
        // className={`cell ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''} ${
        //   isUnavailable ? 'unavailable' : ''
        // }`}
      >
        <div className="date">{formattedDate}</div>
        <div className="dot-indicator" />
      </div>
    </td>
  );
}
