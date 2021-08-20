<script lang="ts">
  // TODO: Rever a ação click()
  import { onMount } from "svelte";
  import type { Message } from "../services/Message";
  import { form as formJS } from "../form.js";
  import { event } from "../stores.js";

  export let id: string;
  export let create: string;
  export let update: string;

  enum Actions {
    CREATE_DATA = "createDocument",
    UPDATE_DATA = "updateDocument",
  }

  const messageFrom = id + "/Form";

  let action = Actions.CREATE_DATA;
  let modalEl: HTMLElement;

  // Local Actions
  function onSubmit(event: Event) {
    // prevent the submit action
    event.preventDefault();
    if (formJS.validate(id)) {
      actions[action](event);
    }
  }

  // Global Actions
  const actions = {
    fillForm: (message: Message) => {
      formJS.click();
      event.dispatch(messageFrom, id, "fillForm", message.content);
      action = Actions.UPDATE_DATA;
    },
    createDocument: (e: Event) => {
      event.dispatch(messageFrom, id, "changeData", create);
      formJS.click();
    },
    updateDocument: (e: Event) => {
      event.dispatch(messageFrom, id, "changeData", update);
      formJS.click();
    },
  };

  event.listener(messageFrom, actions);

  onMount(() => {
    modalEl = document.getElementById(id + "-modal");

    // Modal Events
    modalEl.addEventListener("hidden.bs.modal", function (e: any) {
      action = Actions.CREATE_DATA;
    });

    modalEl.addEventListener("show.bs.modal", function (e: any) {
      formJS.cleanErrors(id);
      event.dispatch(messageFrom, id, "newData");
    });

    modalEl.addEventListener("shown.bs.modal", function (e: any) {
      formJS.focusFirstElement(id);
    });
  });
</script>

<!-- Form -->
<form id="{id}" method="post" on:submit="{onSubmit}">
  <slot />
  <div class="modal-footer">
    <a href="{'#'}" class="btn btn-link link-secondary" data-bs-dismiss="modal">
      Cancel
    </a>
    {#if action == Actions.UPDATE_DATA}
      <input type="submit" class="btn btn-primary ms-auto" value="Alterar" />
      <input type="hidden" name="action" value="{update}" />
    {:else}
      <input type="submit" class="btn btn-primary ms-auto" value="Incluir" />
      <input type="hidden" name="action" value="{create}" />
    {/if}
  </div>
</form>
