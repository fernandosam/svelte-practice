<script>
  import { event } from "./stores.js";

  const component = "BookFields";

  let book = {};

  // Actions
  const actions = {
    fillForm: (e) => {
      book = e.object;
    },
    create: () => {
      event.dispatch("createBook", "Collection", book);
    },
    update: () => {
      event.dispatch("updateBook", "Collection", book);
    },
  };

  event.listener(component, actions);
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
<div class="mt-2">
  {#if book.id}
    <button type="submit" class="btn btn-primary"> Alterar Livro </button>
    <input type="hidden" name="action" value="update" />
  {:else}
    <button type="submit" class="btn btn-primary"> Incluir Livro </button>
    <input type="hidden" name="action" value="create" />
  {/if}
</div>