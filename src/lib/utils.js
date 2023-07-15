export const formatDuplicatedTitle = (title, isDuplicate = false) => {
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

export const truncate = (value) => (value.length >= 20 ? `${value.slice(0, 22)}...` : value);
