import { differenceInMinutes, endOfToday, format, startOfToday } from 'date-fns';

export const formatDuplicatedTitle = (title: string, isDuplicate = false) => {
  const isAlreadyDuplicate = Boolean(title.match(/[()]/));

  if (isAlreadyDuplicate && isDuplicate) {
    const valueInBracket = Number(title.match(/\((.*)\)/)?.[1]);

    const titleWithoutIndex = title
      .replace(/[{()}]/g, '')
      ?.slice(0, -1)
      ?.trim();
    return `${titleWithoutIndex} (${valueInBracket + 1})`;
  }

  return `${title} (1)`;
};

export const truncate = (value: string) =>
  value.length >= 40 ? `${value.slice(0, 26)}...` : value;

export function formatDateString(date: Date, pattern = 'y-MM-dd') {
  return format(date, pattern);
}

export const getDayPercentageCompleted = () => {
  const now: Date = new Date();
  const start: Date = startOfToday();
  const end: Date = endOfToday();

  const totalMinutes = differenceInMinutes(end, start);
  const elapsedMinutes = differenceInMinutes(now, start);

  const remainingPercentage: number = (elapsedMinutes / totalMinutes) * 100;

  return Number(remainingPercentage.toFixed(2));
};

export const entryHasValidContent = (entry: string) => {
  if (!entry) return false;

  // TODO: refactor later when files are switched to markdown
  const parsedEntry = JSON.parse(entry);
  if (parsedEntry?.root?.children.length === 0) return false;

  return true;
};
