<script>
  export let id;
  export let title;
</script>

<div
  id="{id}-modal"
  class="modal modal-blur fade"
  tabindex="-1"
  style="display: none;"
  aria-hidden="true"
>
  <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">
          {title}
        </h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        />
      </div>
      <slot />
    </div>
  </div>
</div>
