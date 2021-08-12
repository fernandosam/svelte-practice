// localStore.js
import { writable } from "svelte/store";

// Event store
export const eventStore = () => {
    // Generate random key
    function newId(length) {
        var result = "";
        var characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
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
        event.id = newId(5);
        event.name = name;
        event.target = target;
        event.object = object;
        return event;
    }

    // create the underlying writable store
    const { subscribe, set } = writable({});

    return {
        dispatch: (component, action, object = null) => {
            let event = createEvent(action, component, object);
            //console.log(event);
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