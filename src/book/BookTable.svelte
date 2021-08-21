<script>
  import { books, event } from "../stores.js";
  //import { data } from "../data/test.js";
  import { onMount } from "svelte";
  import jquery from "jquery";

  // Local Actions
  function onEdit(book) {
    event.dispatch("BookTable", "BookForm/Form", "fillForm", book);
  }

  function onDelete(book) {
    event.dispatch("BookTable", "Collection", "deleteBook", book);
  }

  onMount(() => {
    //jquery("#BookTable").DataTable();
  });
</script>

<!-- List Books -->

<div class="table-responsive">
  <table
    class="table card-table table-vcenter text-nowrap datatable no-footer"
    id="BookTable"
  >
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
</style>
