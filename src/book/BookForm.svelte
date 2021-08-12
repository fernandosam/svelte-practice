<script>
  import { event } from "../stores.js";

  let book = newBook();

  // Local Actions
  function newBook() {
    return {
      title: "",
      price: "",
      description: "",
    };
  }

  // Global Actions
  const actions = {
    fillForm: (e) => {
      book = e.object;
    },
    create: () => {
      event.dispatch("Collection", "createBook", book);
      book = newBook();
    },
    update: () => {
      event.dispatch("Collection", "updateBook", book);
      event.dispatch("BookForm/Form", "changeAction", "create");
      book = newBook();
    },
  };

  event.listener("BookForm", actions);
</script>

<div class="mb-3">
  <div class="form-label required">Título</div>
  <input type="text" class="form-control" bind:value={book.title} />
</div>
<div class="mb-3">
  <div class="form-label required">Preço</div>
  <input type="number" class="form-control" bind:value={book.price} />
</div>
<div class="mb-3">
  <div class="form-label required">Descrição</div>
  <input type="text" class="form-control" bind:value={book.description} />
</div>
