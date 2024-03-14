import { Calendar, CalendarDate, createCalendar, parseDate } from '@internationalized/date';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PressEvent, useCalendar, useLocale } from 'react-aria';
import { useCalendarState } from 'react-stately';

import { DatePickerGrid } from './DatePicker.Grid';

const Button = ({ onPress, onFocusChange, ...rest }: { onPress?: (e: PressEvent) => void }) => {
  //@ts-ignore
  return <button {...rest} onClick={onPress} />;
};

type DatePickerProps = {
  value?: string;
  onChange: (date: CalendarDate) => void;
  showDotIndicator?: (date: Date) => boolean;
};

export const DatePicker = (props: DatePickerProps) => {
  const { showDotIndicator, onChange, value } = props;
  let { locale } = useLocale();

  let state = useCalendarState({
    onChange,
    value: parseDate(value) || null,
    locale,
    createCalendar,
  });

  let { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar(
    {
      onChange,
      value: parseDate(value) || null,
    },
    state,
  );

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

      <DatePickerGrid state={state} showDotIndicator={showDotIndicator} />
    </div>
  );
};
