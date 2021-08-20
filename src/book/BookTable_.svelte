<script>
  import { books, event } from "../stores.js";
  import { data } from "../data/test.js";
  import { Datatable, rows } from "svelte-simple-datatables";

  const settings = { columnFilter: true };

  // Local Actions
  function onEdit(book) {
    event.dispatch("BookTable", "BookForm/Form", "fillForm", book);
  }

  function onDelete(book) {
    event.dispatch("BookTable", "Collection", "deleteBook", book);
  }
</script>

<Datatable settings="{settings}" data="{data}">
  <thead>
    <th data-key="first_name">First Name</th>
    <th data-key="last_name">Last Name</th>
    <th data-key="email">Email</th>
  </thead>
  <tbody>
    {#each $rows as row}
      <tr>
        <td>{row.first_name}</td>
        <td>{row.last_name}</td>
        <td>{row.email}</td>
      </tr>
    {/each}
  </tbody>
</Datatable>

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
        <th class="w-1"></th>
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
              ><a href="{'#'}" class="text-reset">{book.description}</a></td
            >
            <td>
              <div class="btn-list flex-nowrap">
                <a
                  href="{'#'}"
                  class="btn btn-white"
                  on:click="{() => onEdit(book)}"
                >
                  Alterar
                </a>
                <a
                  href="{'#'}"
                  on:click="{() => onDelete(book)}"
                  class="btn btn-white"
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

<style>
  td {
    text-align: center;
    padding: 4px 0;
  }
</style>
