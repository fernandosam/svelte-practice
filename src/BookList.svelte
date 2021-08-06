<script>
  import Card from "./Card.svelte";
  import { books, purchases, event } from "./stores.js";

  // Events
  function onEdit(object) {
    event.dispatch("fillForm", "BookFields", object);
  }

  function onDelete(object) {
    event.dispatch("deleteBook", "Collection", object);
  }
</script>

<!-- List Books -->
<Card title="Livros Adicionados">
  <div class="table-responsive">
    <table class="table table-vcenter card-table">
      <thead>
        <tr>
          <th class="w-7">Título</th>
          <th>Preço</th>
          <th>Descrição</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {#if $books.length === 0}
          <tr>
            <td colspan="4" class="text-center">Nenhum livro adicionado.</td>
          </tr>
        {:else}
          {#each $books as book}
            <tr>
              <td>{book.title}</td>
              <td class="text-muted">{book.price}</td>
              <td class="text-muted"
                ><a href="#" class="text-reset">{book.description}</a></td
              >
              <td>
                <div class="btn-list flex-nowrap">
                  <a
                    href="#"
                    class="btn btn-white"
                    on:click={() => onEdit(book)}
                  >
                    Edit
                  </a>
                  <a
                    href="#"
                    on:click={() => onDelete(book)}
                    class="btn btn-white"
                  >
                    Delete
                  </a>
                </div>
              </td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
</Card>

<!-- <Book bookTitle={book.title} bookPrice={book.price} bookDescription={book.description} on:buy={purchaseBook} /> -->
