<script>
  import { onMount } from "svelte";
  import Card from "./Card.svelte";
  import { form } from "../form.js";
  import { event } from "../stores.js";

  export let id;
  let action = "create";
  
  // Local Actions
  function onSubmit(e) {
    if (form.validate(e)) {
      event.dispatch(id, action);
      form.focusFirstElement(id);
    } else {
      // Alert
      // Show Alert
    }
    e.preventDefault();
  }

  // Global Actions
  const actions = {
    changeAction: (e) => {
      action = e.object;
    },
    fillForm: (e) => {
      const object = e.object;
      event.dispatch(id, "fillForm", object);
      action = "update";
    },
  };

  event.listener(id+"/Form", actions);

  onMount(() => {
    form.focusFirstElement(id);
  });
</script>

<!-- Form -->
<Card>
  <form {id} method="post" on:submit={onSubmit}>
    <fieldset class="form-fieldset">
      <slot/>
      <div class="mt-2">
        {#if action == "update"}
          <button type="submit" class="btn btn-primary">Alterar</button>
          <input type="hidden" name="action" value="update" />
        {:else}
          <button type="submit" class="btn btn-primary">Incluir</button>
          <input type="hidden" name="action" value="create" />
        {/if}
      </div>
    </fieldset>
  </form>
</Card>
