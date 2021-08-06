<script>
  import { onMount } from "svelte";
  import Card from "./Card.svelte";
  import { form } from "./form.js";
  import { event } from "./stores.js";

  export let id;

  let fieldset;

  function onSubmit(e) { 
    if (form.validate(e)) {
      const action = form.action(fieldset);
      event.dispatch(action, id);
    } else {
      // Alert
      e.preventDefault();
    }
  }

  onMount(() => {
    form.focusFirst(fieldset);
  });
</script>

<!-- Form -->
<Card>
  <form {id} method="post" on:submit={onSubmit}>
    <fieldset class="form-fieldset" bind:this={fieldset}>
      <slot/>
    </fieldset>
  </form>
</Card>
