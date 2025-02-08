export const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const toBackendDate = (date: Date) => {
  return date.toISOString();
};
