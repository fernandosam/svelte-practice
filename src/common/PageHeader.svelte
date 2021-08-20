<script lang="ts">
  export let title: string, pretitle: string, label: string, formTarget: string;
</script>

<div class="page-wrapper">
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
            id="data-add"
            href={"#"}
            class="btn btn-primary d-none d-sm-inline-block"
            data-bs-toggle="modal"
            data-bs-target="#{formTarget}-modal"
          >
            <i class="ti ti-plus icon" />
            Adicionar {label}
          </a>
          <a
            href={"#"}
            class="btn btn-primary d-sm-none btn-icon"
            data-bs-toggle="modal"
            data-bs-target="#BookForm-modal"
            aria-label="Adicionar Novo Livro"
          >
            <i class="ti ti-plus icon" />
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
