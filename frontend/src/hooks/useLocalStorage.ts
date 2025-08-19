import { useState, useCallback } from 'react';

/**
 * Custom hook that persists state in localStorage
 * Automatically saves changes and restores on component mount
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
    onError?: (error: Error, operation: 'load' | 'save') => void;
  } = {}
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    onError = (error, operation) => console.error(`localStorage ${operation} error for key "${key}":`, error)
  } = options;

  // Initialize state from localStorage or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return initialValue;
      return deserialize(item);
    } catch (error) {
      onError(error as Error, 'load');
      return initialValue;
    }
  });

  // Save to localStorage whenever value changes
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function for functional updates
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      // Save to localStorage
      window.localStorage.setItem(key, serialize(valueToStore));
    } catch (error) {
      onError(error as Error, 'save');
    }
  }, [key, serialize, storedValue, onError]);

  // Clear the value from localStorage and reset to initial
  const clearValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      onError(error as Error, 'save');
    }
  }, [key, initialValue, onError]);

  return [storedValue, setValue, clearValue];
}

/**
 * Hook specifically for debounced localStorage updates
 * Useful for frequently changing data like draft text
 */
export function useDebouncedLocalStorage<T>(
  key: string,
  initialValue: T,
  delay: number = 1000,
  options: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
    onError?: (error: Error, operation: 'load' | 'save') => void;
  } = {}
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  
  const [storedValue, setStoredValue, clearValue] = useLocalStorage<T>(key, initialValue, options);
  const [pendingValue, setPendingValue] = useState<T | null>(null);

  // Debounced update function
  const setDebouncedValue = useCallback((value: T | ((val: T) => T)) => {
    const newValue = typeof value === 'function' ? (value as (val: T) => T)(storedValue) : value;
    setPendingValue(newValue);
    
    // Update UI immediately
    setStoredValue(newValue);
    
    // Clear previous timeout
    const timeoutId = setTimeout(() => {
      setPendingValue(null);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [storedValue, setStoredValue, delay]);

  return [storedValue, setDebouncedValue, clearValue];
}

/**
 * Utility function to get current localStorage usage
 */
export function getLocalStorageUsage(): { used: number; total: number; percentage: number } {
  try {
    let total = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage.getItem(key)?.length || 0;
      }
    }
    
    // Most browsers have 5-10MB limit
    const estimatedLimit = 5 * 1024 * 1024; // 5MB
    
    return {
      used: total,
      total: estimatedLimit,
      percentage: Math.round((total / estimatedLimit) * 100)
    };
  } catch {
    return { used: 0, total: 0, percentage: 0 };
  }
}

/**
 * Check if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__localStorage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}