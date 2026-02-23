import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue, prefix = '') => {
  const prefixedKey = `${prefix}${key}`;

  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(prefixedKey);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(prefixedKey, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }, [storedValue, prefixedKey]);

  return [storedValue, setStoredValue];
};
