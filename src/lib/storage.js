export const getData = (name) => {
  const data = window?.localStorage.getItem(name);

  return (data && JSON.parse(data)) || null;
};

export const clearData = (name) => {
  window.localStorage.removeItem(name);
};

export const setData = (name, value) => {
  clearData(name);
  window.localStorage.setItem(name, JSON.stringify(value));
};
