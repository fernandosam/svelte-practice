import { writable } from "svelte/store";
import { localStore } from "./localStore.js";
import { eventStore } from "./eventStore.js";

const books = localStore("books", []);
const event = eventStore();
const purchases = writable([]);

export { books, event, purchases };
