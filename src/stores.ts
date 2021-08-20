import { localStore } from "./localStore";
import { eventStore } from "./eventStore";

const books = localStore("books", []);
const event = eventStore();

export { books, event };
