
export const getData = (name) => {
  const cookie = window?.localStorage.getItem(name);
  return (cookie && JSON.parse(cookie)) || null;
};

export const clearData = (name) => {
  window.localStorage.removeItem(name);
};

export const setData = (name, value) => {
  clearData(name);
  window.localStorage.setItem(name, JSON.stringify(value));
};
