<script lang="ts">
  import { event } from "../stores.js";
  import Form from "../common/Form.svelte";
  import Modal from "../common/Modal.svelte";
  import type { Message } from "../services/Message";

  export let id: string;
  export let title: string;

  let data: any = {};

  enum Actions {
    CREATE_DATA = "createBook",
    UPDATE_DATA = "updateBook",
  }

  const dataModel = {
    title: "",
    price: "",
    description: "",
  };

  // Global Actions
  const actions = {
    newData: () => {
      data = { ...dataModel };
    },
    fillForm: (message: Message) => {
      data = message.content;
    },
    changeData: (message: Message) => {
      const action = message.content;
      event.dispatch(id, "Collection", String(action), data);
    },
  };

  event.listener(id, actions);
</script>

<Modal id="{id}" title="{title}">
  <Form id="{id}" create="{Actions.CREATE_DATA}" update="{Actions.UPDATE_DATA}">
    <div class="modal-body">
      <div class="mb-3">
        <div class="form-label required">Título</div>
        <input type="text" class="form-control" bind:value="{data.title}" />
      </div>
      <div class="mb-3">
        <div class="form-label required">Preço</div>
        <input type="number" class="form-control" bind:value="{data.price}" />
      </div>
      <div class="mb-3">
        <div class="form-label required">Descrição</div>
        <input
          type="text"
          class="form-control"
          bind:value="{data.description}"
        />
      </div>
    </div>
  </Form>
</Modal>
