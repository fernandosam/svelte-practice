<script>
  function toggle() {
    window.document.body.classList.toggle("theme-dark");
  }
</script>

<header class="navbar navbar-expand-md navbar-dark d-print-none">
  <div class="container-xl">
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbar-menu"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <h1
      class="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3"
    >
      <a href=".">
        <img
          src="./static/logo-white.svg"
          width="110"
          height="32"
          alt="Tabler"
          class="navbar-brand-image"
        />
      </a>
    </h1>
    <div class="navbar-nav flex-row order-md-last">
      <div class="nav-item dropdown d-none d-md-flex me-3">
        <a
          href="{'#'}"
          class="nav-link px-0"
          data-bs-toggle="dropdown"
          tabindex="-1"
          aria-label="Show notifications"
          on:click="{toggle}"
        >
          <i class="ti ti-bell icon"></i>
          <span class="badge bg-red"></span>
        </a>
        <div class="dropdown-menu dropdown-menu-end dropdown-menu-card">
          <div class="card">
            <div class="card-body">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Accusamus ad amet consectetur exercitationem fugiat in ipsa ipsum,
              natus odio quidem quod repudiandae sapiente. Amet debitis et magni
              maxime necessitatibus ullam.
            </div>
          </div>
        </div>
      </div>
      <div class="nav-item dropdown">
        <a
          href="{'#'}"
          class="nav-link d-flex lh-1 text-reset p-0"
          data-bs-toggle="dropdown"
          aria-label="Open user menu"
        >
          <span
            class="avatar avatar-sm"
            style="background-image: url(./static/avatars/003f.jpg)"></span>
          <div class="d-none d-xl-block ps-2">
            <div>Fernando Chagas</div>
            <div class="mt-1 small text-muted">Tax Accountant</div>
          </div>
        </a>
        <div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
          <a href="{'#'}" class="dropdown-item">Set status</a>
          <a href="{'#'}" class="dropdown-item">Profile &amp; account</a>
          <a href="{'#'}" class="dropdown-item">Feedback</a>
          <div class="dropdown-divider"></div>
          <a href="{'#'}" class="dropdown-item">Settings</a>
          <a href="{'#'}" class="dropdown-item">Logout</a>
        </div>
      </div>
    </div>
  </div>
</header>
