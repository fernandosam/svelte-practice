<script>
  import { createEventDispatcher } from "svelte";
  
  export let bookTitle;
  export let bookPrice;
  export let bookDescription;

  const dispatch = createEventDispatcher();

  function purchaseBook() {
    dispatch("buy", bookTitle);
  }
</script>

<div>
  <h1>{bookTitle}</h1>
  <h2>{bookPrice}</h2>
  <p>{bookDescription}</p>
  <button type="submit" class="btn btn-primary" on:click={purchaseBook}>
    Buy
  </button>
</div>
