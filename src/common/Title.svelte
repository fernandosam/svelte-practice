<script>
  export let title;
  export let pretitle;

  // TODO: ARRUMAR O data-bs-target
</script>

<div class="page-wrapper">
  <!-- Page title -->
  <div class="page-header d-print-none">
    <div class="row align-items-center">
      <div class="col">
        {#if pretitle}
          <div class="page-pretitle">
            {pretitle}
          </div>
        {/if}
        <h2 class="page-title">{title}</h2>
      </div>
      <div class="col-auto ms-auto d-print-none">
        <div class="btn-list">
          <a
            href="#"
            class="btn btn-primary d-none d-sm-inline-block"
            data-bs-toggle="modal"
            data-bs-target="#BookForm-modal"
          >
            <!-- Download SVG icon from http://tabler-icons.io/i/plus -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line
                x1="12"
                y1="5"
                x2="12"
                y2="19"
              /><line x1="5" y1="12" x2="19" y2="12" /></svg
            >
            Adicionar Livro
          </a>
          <a
            href="#"
            class="btn btn-primary d-sm-none btn-icon"
            data-bs-toggle="modal"
            data-bs-target="#BookForm-modal"
            aria-label="Adicionar Novo Livro"
          >
            <!-- Download SVG icon from http://tabler-icons.io/i/plus -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line
                x1="12"
                y1="5"
                x2="12"
                y2="19"
              /><line x1="5" y1="12" x2="19" y2="12" /></svg
            >
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
