
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useIsMounted } from './use-is-mounted';

function getStorageValue<T>(key: string, initialValue: T): T {
  if (typeof window === 'undefined') {
    return initialValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.error(`Error reading localStorage key “${key}”:`, error);
    return initialValue;
  }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const isMounted = useIsMounted();

  useEffect(() => {
    if (isMounted) {
      setStoredValue(getStorageValue(key, initialValue));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      if (typeof window === 'undefined' || !isMounted) {
        console.warn(
          `Tried to set localStorage key “${key}” even though the component is not mounted yet.`
        );
        return;
      }
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key “${key}”:`, error);
      }
    },
    [isMounted, key, storedValue]
  );
  
  useEffect(() => {
    if (!isMounted) {
      return;
    }
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [isMounted, key]);


  return [storedValue, setValue];
}
