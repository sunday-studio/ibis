import { useCallback } from 'react';

import { CalendarDate, createCalendar, parseDate } from '@internationalized/date';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PressEvent, useCalendar, useLocale } from 'react-aria';
import { useCalendarState } from 'react-stately';

import { DatePickerGrid } from './DatePicker.Grid';

//@ts-ignore
const Button = ({ onPress, onFocusChange, ...rest }: { onPress?: (e: PressEvent) => void }) => {
  //@ts-ignore
  return <button {...rest} onClick={onPress} />;
};

type DatePickerProps = {
  value?: string;
  onChange: (date: Date) => void;
  showDotIndicator?: (date: Date) => boolean;
};

export const DatePicker = (props: DatePickerProps) => {
  const { showDotIndicator, onChange, value } = props;
  let { locale } = useLocale();

  const dateValue = parseDate(new Date(value).toISOString().split('T')[0]) ?? null;

  const handleOnChange = useCallback((date: CalendarDate) => {
    return onChange(new Date(date as unknown as Date));
  }, []);

  let state = useCalendarState({
    onChange: handleOnChange,
    value: dateValue,
    locale,
    createCalendar,
  });

  let { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar(
    {
      onChange: handleOnChange,
      value: dateValue,
    },
    state,
  );

  return (
    <div {...calendarProps} className="datepicker popover-container">
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
