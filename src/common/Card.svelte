<script>
  export let title = "";
</script>

<div class="card">
  {#if title}
    <div class="card-header">
      <h3 class="card-title">{title}</h3>
    </div>
  {/if}
  <slot />
</div>
