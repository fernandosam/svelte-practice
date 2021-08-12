<script>
  import Header from "./Header.svelte";
  import Footer from "./Footer.svelte";
</script>

<Header/>
<div class="container-xl">
  <slot />
</div>
<Footer />

<style>
  :global(body) {
    transition: background-color 0.3s;
  }
</style>