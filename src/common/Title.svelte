<script>
  export let title;
  export let pretitle = null;
</script>

<div class="page-wrapper">
  <!-- Page title -->
  <div class="page-header d-print-none">
    <div class="row align-items-center">
      <div class="col">
        <div class="page-pretitle">
          {pretitle}
        </div>
        <h2 class="page-title">{title}</h2>
      </div>
    </div>
  </div>
</div>