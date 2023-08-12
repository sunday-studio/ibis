import { format } from 'date-fns';

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
