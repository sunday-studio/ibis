export const formatDuplicatedTitle = (title) => {
  console.log({ title, a: title.split(' ').map((e) => e.includes('(')) });
};
