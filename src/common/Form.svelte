<script lang="ts">
  import { onMount } from "svelte";
  import { form as formJS } from "../form.js";
  import { event } from "../stores.js";

  export let id: string;
  let action = "createData";

  // Local Actions
  function onSubmit(e: any) {
    if (formJS.validate(id)) {
      actions[action]();
      formJS.focusFirstElement(id);
    }
    e.preventDefault();
  }

  // Global Actions
  const actions = {
    fillForm: (e: any) => {
      event.dispatch(id, "fillForm", e.object);
      formJS.cleanErrors(id);
      action = "updateData";
    },
    createData: () => {
      event.dispatch(id, "createData");
    },
    updateData: () => {
      event.dispatch(id, "updateData");
      action = "createData";
    },
  };

  event.listener(id + "/Form", actions);

  onMount(() => {
    var modalEl = document.getElementById(id + "-modal");

    // Close Modal
    modalEl.addEventListener("hidden.bs.modal", function (e) {
      formJS.cleanErrors(id);
      event.dispatch(id, "newData");
    });

    formJS.focusFirstElement(id);
  });
</script>

<!-- Form -->
<form {id} method="post" on:submit={onSubmit}>
  <slot />
  <div class="modal-footer">
    <a href="#" class="btn btn-link link-secondary" data-bs-dismiss="modal">
      Cancel
    </a>
    {#if action == "updateData"}
      <input type="submit" class="btn btn-primary ms-auto" value="Alterar" />
      <input type="hidden" name="action" value="updateData" />
    {:else}
      <input type="submit" class="btn btn-primary ms-auto" value="Incluir" />
      <input type="hidden" name="action" value="createData" />
    {/if}
  </div>
</form>
