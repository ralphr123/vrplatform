const parseIfObject = (value: string | null) => {
  try {
    return JSON.parse(value || "");
  } catch (e) {
    return value;
  }
};

export const setLocalStorage = <T>(key: string, value: T) => {
  window.localStorage.setItem(key, JSON.stringify(value));
  return value;
};

export const getLocalStorage = <T = string>(key: string): T | undefined =>
  parseIfObject(window.localStorage.getItem(key)) as T | undefined;
