<script>
  export let title = "";
</script>

<div class="card">
  {#if title}
    <div class="card-header">
      <h3 class="card-title">Livros Adicionados</h3>
    </div>
  {/if}
  <div class="card-body">
    <slot />
  </div>
</div>
