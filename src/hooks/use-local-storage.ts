
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useIsMounted } from './use-is-mounted';

// This is a helper function to safely get a value from localStorage
function getStorageValue<T>(key: string, initialValue: T): T {
  if (typeof window === 'undefined') {
    return initialValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return initialValue;
  }
}


export function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const isMounted = useIsMounted();
  
  // We use a function with useState to ensure the initial value is only read once.
  const [storedValue, setStoredValue] = useState<T>(() => getStorageValue(key, initialValue));

  const setValue: React.Dispatch<React.SetStateAction<T>> = useCallback(
    (value) => {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (isMounted) {
          try {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          } catch (error) {
            console.error(`Error writing to localStorage key "${key}":`, error);
          }
      }
    },
    [key, storedValue, isMounted]
  );
  
  // This effect will update the state if the localStorage value changes in another tab.
  useEffect(() => {
      if (!isMounted) return;

      const handleStorageChange = (e: StorageEvent) => {
          if (e.key === key) {
              setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
          }
      };
      window.addEventListener('storage', handleStorageChange);
      return () => {
          window.removeEventListener('storage', handleStorageChange);
      };
  }, [key, initialValue, isMounted]);

  // When the component mounts on the client, we re-read from localStorage
  // This handles the case where the server-rendered value is different.
  useEffect(() => {
    if (isMounted) {
      setStoredValue(getStorageValue(key, initialValue));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);


  return [storedValue, setValue];
}
