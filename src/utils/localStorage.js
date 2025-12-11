// src/utils/localStorage.js

// Safe check for browser/localStorage exists
const isBrowser = typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export const saveToLocalStorage = (key, value) => {
  if (!isBrowser) return;
  try {
    const data = JSON.stringify(value);
    window.localStorage.setItem(key, data);
  } catch (error) {
    console.error("Error saving to localStorage", error);
  }
};

export const getFromLocalStorage = (key, defaultValue = null) => {
  if (!isBrowser) return defaultValue;
  try {
    const storedValue = window.localStorage.getItem(key);
    if (storedValue === null || storedValue === undefined) return defaultValue;
    return JSON.parse(storedValue);
  } catch (error) {
    console.error("Error reading from localStorage", error);
    return defaultValue;
  }
};

export const removeFromLocalStorage = (key) => {
  if (!isBrowser) return;
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing from localStorage", error);
  }
};
