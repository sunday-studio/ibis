import {
  addWeeks,
  endOfMonth as dfEndOfMonth,
  isSameDay as dfIsSameDay,
  startOfMonth as dfStartOfMonth,
  startOfWeek as dfStartOfWeek,
  endOfWeek as dfendOfWeek,
  format,
  isWithinInterval,
} from 'date-fns';

/**
 *
 * @param date
 * @returns
 */
export function getStartofWeek(date: Date | string) {
  return dfStartOfWeek(new Date(date), {
    weekStartsOn: 0,
  });
}

/**
 *
 * @param date
 */
export function getDaysInWeek(date: Date | string) {
  const endDate = dfendOfWeek(new Date(date));
  const startDate = dfStartOfWeek(new Date(date));

  const dates = [];

  // Strip hours minutes seconds etc.
  let currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());

  while (currentDate <= endDate) {
    dates.push(currentDate);
    currentDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 1,
    );
  }

  return dates;
}

/**
 *
 * @param date
 */
export function getWeeksInMonth(date: Date | string) {
  let startOfMonth = dfStartOfMonth(new Date(date));

  const weeksInMonth: number = 6;

  let weeks: any[] = [];

  for (let week = 0; week < weeksInMonth; week++) {
    weeks.push(getDaysInWeek(startOfMonth));
    startOfMonth = addWeeks(startOfMonth, 1);
  }

  return weeks;
}

/**
 *
 * @param param0
 * @returns
 */
export function InCurrentMonth({ date, monthDate }: { date: Date; monthDate: Date }) {
  return isWithinInterval(new Date(date), {
    start: dfStartOfMonth(new Date(monthDate)),
    end: dfEndOfMonth(new Date(monthDate)),
  });
}

export function isSameDate(date1: Date, date2: Date) {
  if (date1 && date2) {
    return dfIsSameDay(date1, date2);
  } else {
    return !date1 && !date2;
  }
}

export function getHeaderDays() {
  const days = getDaysInWeek(new Date());
  return days.map((day: string | Date) => format(new Date(day), 'EEE'));
}
