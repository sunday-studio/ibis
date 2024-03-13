import { createCalendar } from '@internationalized/date';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PressEvent, useCalendar, useLocale } from 'react-aria';
import { useCalendarState } from 'react-stately';

import { DatePickerGrid } from './DatePicker.Grid';

const Button = ({ onPress, ...rest }: { onPress?: (e: PressEvent) => void }) => {
  //@ts-ignore
  return <button {...rest} onClick={onPress} />;
};

type DatePickerProps = {
  size?: 'small' | 'default';
  selectedDate?: string | Date;
  onChange: (date: Date) => void;
};

export const DatePicker = () => {
  let { locale } = useLocale();

  let state = useCalendarState({
    locale,
    createCalendar,
  });

  let { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar({}, state);

  return (
    <div {...calendarProps} className="datepicker">
      <div className="datepicker-header">
        <h2>{title}</h2>
        <Button {...prevButtonProps}>
          <ChevronLeft />
        </Button>
        <Button {...nextButtonProps}>
          <ChevronRight />
        </Button>
      </div>

      <DatePickerGrid state={state} />
    </div>
  );
};
