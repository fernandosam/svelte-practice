<script>
  import { event, books } from "./stores.js";

  // Local Actions
  function generateId(array) {
    return array.length ? Math.max(...array.map((t) => t.id)) + 1 : 1;
  }

  function create(object, list) {
    object.id = generateId(list);
    list = [...list, object];
    return list;
  }

  function update(object, list) {
    const i = list.findIndex((t) => t.id === object.id);
    list[i] = { ...list[i], ...object };
    return { key: i, value: list[i] };
  }

  function remove(object, list) {
    list = list.filter((t) => t.id !== object.id);
    return list;
  }

  // Global Actions
  const actions = {
    // Book
    createBook: (event) => {
      $books = create(event.object, $books);
    },
    updateBook: (event) => {
      const { key, value } = update(event.object, $books);
      $books[key] = value;
    },
    deleteBook: (event) => {
      $books = remove(event.object, $books);
    },
  };

  event.listener("Collection", actions);
</script>
