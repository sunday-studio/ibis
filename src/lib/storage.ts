export const getData = (name: string) => {
  const data = window?.localStorage.getItem(name);

  return (data && JSON.parse(data)) || null;
};

export const clearData = (name: string) => {
  window.localStorage.removeItem(name);
};

export const setData = (name: string, value: any) => {
  clearData(name);
  window.localStorage.setItem(name, JSON.stringify(value));
};
