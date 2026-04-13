import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue, { prefix = '' } = {}) => {
  const fullKey = prefix + key;
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(fullKey);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch { return initialValue; }
  });
  useEffect(() => {
    try { localStorage.setItem(fullKey, JSON.stringify(value)); }
    catch { /* quota exceeded */ }
  }, [value, fullKey]);
  return [value, setValue];
};
