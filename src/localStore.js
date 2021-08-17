// localStore.js
import { writable } from "svelte/store";

// receives the key of the local storage and an initial value
export const localStore = (key, initial) => {
  // helper functions
  const toString = (value) => JSON.stringify(value, null, 2);
  const toObj = JSON.parse;

  // item not present in local storage
  if (localStorage.getItem(key) === null) {
    // initialize local storage with initial value
    localStorage.setItem(key, toString(initial));
  }

  // convert to object
  const saved = toObj(localStorage.getItem(key));

  // create the underlying writable store
  const { subscribe, set, update } = writable(saved);

  return {
    subscribe,
    set: (value) => {
      // save also to local storage as a string
      localStorage.setItem(key, toString(value));
      return set(value);
    },
    update,
  };
};
