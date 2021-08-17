<script>
  import { books, event } from "../stores.js";
  import BookModal from "./BookModal.svelte";

  // Local Actions
  function onEdit(book) {
    event.dispatch("Alert", "hidden");
    event.dispatch("BookForm/Form", "fillForm", book);
  }

  function onDelete(book) {
    event.dispatch("Alert", "hidden");
    event.dispatch("Collection", "deleteBook", book);
  }
</script>

<!-- Add Book -->
<BookModal id="BookForm" title="Novo Livro" />

<!-- List Books -->
<div class="card-body border-bottom py-3">
  <div class="d-flex">
    <div class="text-muted">
      Show
      <div class="mx-2 d-inline-block">
        <input
          type="text"
          class="form-control form-control-sm"
          value="8"
          size="3"
          aria-label="Invoices count"
        />
      </div>
      entries
    </div>
    <div class="ms-auto text-muted">
      Search:
      <div class="ms-2 d-inline-block">
        <input
          type="text"
          class="form-control form-control-sm"
          aria-label="Search invoice"
        />
      </div>
    </div>
  </div>
</div>
<div class="table-responsive">
  <table class="table card-table table-vcenter text-nowrap datatable">
    <thead>
      <tr>
        <th>Título</th>
        <th>Preço</th>
        <th class="w-30">Descrição</th>
        <th class="w-1" />
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
                <a href="#" class="btn btn-info" on:click={() => onEdit(book)}>
                  Alterar
                </a>
                <a
                  href="#"
                  on:click={() => onDelete(book)}
                  class="btn btn-danger"
                >
                  Excluir
                </a>
              </div>
            </td>
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>
