<script>
  import Form from "../common/Form.svelte";
  import Modal from "../common/Modal.svelte";
  import { event } from "../stores.js";

  export let id;
  export let title;

  let data = newData();

  // Local Actions
  function newData() {
    return {
      title: "",
      price: "",
      description: "",
    };
  }

  // Global Actions
  const actions = {
    fillForm: (e) => {
      data = e.object;
    },
    newData: () => {
      data = newData();
    },
    createData: () => {
      event.dispatch("Collection", "createBook", data);
      event.dispatch("Alert", "showSuccess", "Livro cadastrado com sucesso.");
      data = newData();
    },
    updateData: () => {
      event.dispatch("Collection", "updateBook", data);
      event.dispatch("Alert", "showSuccess", "Livro alterado com sucesso.");
      data = newData();
    },
  };

  event.listener(id, actions);
</script>

<Modal {id} {title}>
  <Form {id}>
    <div class="modal-body">
      <div class="mb-3">
        <div class="form-label required">Título</div>
        <input type="text" class="form-control" bind:value={data.title} />
      </div>
      <div class="mb-3">
        <div class="form-label required">Preço</div>
        <input type="number" class="form-control" bind:value={data.price} />
      </div>
      <div class="mb-3">
        <div class="form-label required">Descrição</div>
        <input type="text" class="form-control" bind:value={data.description} />
      </div>
    </div>
  </Form>
</Modal>
