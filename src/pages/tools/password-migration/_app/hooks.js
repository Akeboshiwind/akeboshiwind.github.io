import { useState, useEffect } from 'react';

const STORAGE_PREFIX = 'passwordMigration_';

export function useLocalStorage(key, initialValue) {
  const fullKey = STORAGE_PREFIX + key;
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(fullKey);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(fullKey, JSON.stringify(value));
  }, [fullKey, value]);

  return [value, setValue];
}

export function clearAllStorage() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(STORAGE_PREFIX)) keys.push(key);
  }
  keys.forEach(k => localStorage.removeItem(k));
}
