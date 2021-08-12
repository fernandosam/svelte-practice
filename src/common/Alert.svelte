<script>
  import { event } from "../stores.js";

  const component = "Alert";

  let show = true;

  // Actions
  const actions = {
    alert: () => {
      show = true;
    },
  };

  event.listener(component, actions);
</script>

{#if show}
  <div
    class="alert alert-important alert-danger alert-dismissible"
    role="alert"
  >
    <div class="d-flex">
      <div>
        <!-- Download SVG icon from http://tabler-icons.io/i/alert-circle -->
        <!-- SVG icon code with class="alert-icon" -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon alert-icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><circle
            cx="12"
            cy="12"
            r="9"
          /><line x1="12" y1="8" x2="12" y2="12" /><line
            x1="12"
            y1="16"
            x2="12.01"
            y2="16"
          /></svg
        >
      </div>
      <div>Erro ao incluir dados.</div>
    </div>
    <a class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="close"/>
  </div>
{/if}
