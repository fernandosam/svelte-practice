// localStore.js
import { writable } from "svelte/store";

// Event store
export const eventStore = () => {
  // Generate random key
  function uuid() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
      return (
        c ^
        (window.crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16);
    });
  }

  // Events
  function newEvent() {
    return {
      id: "",
      name: "",
      target: "",
      object: {},
    };
  }

  function createEvent(name, target, object) {
    let event = newEvent();
    event.id = uuid();
    event.name = name;
    event.target = target;
    event.object = object;
    return event;
  }

  // writable store
  const { subscribe, set } = writable({});

  return {
    dispatch: (component, action, object = null) => {
      let event = createEvent(action, component, object);
      console.log(event);
      return set(event);
    },
    listener: (component, actions) => {
      let fn = (event) => {
        if (event.target == component) {
          // Call action
          actions[event.name](event);
        }
      };

      subscribe(fn);
    },
  };
};
