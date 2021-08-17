<script>
  /*
  event.dispatch(
    "Alert",
    "showError",
    "Erro ao cadastrar livro. Por favor, revise os dados que foram enviados."
  );
  */

  import { event } from "../stores.js";

  let show = false;
  let message;
  let css;

  // Actions
  const actions = {
    showError: (e) => {
      show = true;
      message = e.object;
      css = "alert-danger";
    },
    showSuccess: (e) => {
      show = true;
      message = e.object;
      css = "alert-success";
    },
    hidden: (e) => {
      show = false;
    },
  };

  event.listener("Alert", actions);
</script>

{#if show}
  <br />
  <div class="alert alert-title {css}" role="alert">
    {message}
  </div>
{/if}
