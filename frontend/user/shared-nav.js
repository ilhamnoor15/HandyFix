// Shared sidebar navigation for all pages in `frontend/user`.
// Usage: replace the per-page <nav> markup with:
//   <script src="shared-nav.js"></script>
// This script injects the nav exactly where the script tag appears, so existing
// page scripts that query #servicesToggle/#dashboardLink keep working.

(function () {
  const NAV_HTML = `
<nav class="col-md-2 p-0 text-white min-vh-100 shadow d-flex flex-column justify-content-between"
     style="background-color: #4A0E0E; position: fixed;">
  <div>
    <div class="p-4 text-center">
      <h4 class="fw-bold m-0">LOGO</h4>
      <small style="color: #E5A832; letter-spacing: 2px; font-weight: bold;">HandyFix</small>
    </div>

    <ul class="nav flex-column mt-4 ps-3">
      <li class="nav-item mb-2">
        <a href="/" id="dashboardLink" class="nav-link text-white fw-bold opacity-75">
          <i class="bi bi-house-door-fill me-2"></i>Home</a>
      </li>

      <li class="nav-item mb-2">
        <a class="nav-link text-white opacity-75 fw-bold d-flex align-items-center"
           id="servicesToggle" data-bs-toggle="collapse" href="#servicesSubmenu" role="button">
          <i class="bi bi-list-ul me-2"></i>
          <span>Services</span>
        </a>

        <div class="collapse" id="servicesSubmenu">
          <ul class="nav flex-column ms-4 mt-2 mb-2 border-start border-secondary">
            <li class="nav-item">
              <a name="plumbing" onclick="repairNav(this)" class="nav-link text-white opacity-75 py-1 small">
                <i class="bi bi-droplet-fill me-2"></i> Plumbing Services</a>
            </li>
            <li class="nav-item">
              <a name="maintenance" onclick="repairNav(this)" class="nav-link text-white opacity-75 py-1 small">
                <i class="bi bi-house-check-fill me-2"></i>Home Maintenance</a>
            </li>
            <li class="nav-item">
              <a name="electrical" onclick="repairNav(this)" class="nav-link text-white opacity-75 py-1 small">
                <i class="bi bi-lightning-charge-fill me-2"></i>Electrical Services</a>
            </li>
            <li class="nav-item">
              <a name="carpentry" onclick="repairNav(this)" class="nav-link text-white opacity-75 py-1 small">
                <i class="bi bi-tools me-2"></i>Carpentry Services</a>
            </li>
            <li class="nav-item">
              <a name="tool" onclick="repairNav(this)" class="nav-link text-white opacity-75 py-1 small">
                <i class="bi bi-briefcase-fill me-2"></i>Tool Services</a>
            </li>
          </ul>
        </div>
      </li>

      <li class="nav-item mb-2">
        <a href="/user/booking" class="nav-link text-white opacity-75 fw-bold">
          <i class="bi bi-calendar-check me-2"></i> My Bookings</a>
      </li>
      <li class="nav-item mb-2">
        <a href="/user/messages" class="nav-link text-white opacity-75 fw-bold">
          <i class="bi bi-chat-dots me-2"></i> Messages</a>
      </li>
      <li class="nav-item mb-2">
        <a href="/user/profile" class="nav-link text-white opacity-75 fw-bold">
          <i class="bi bi-person-circle me-2"></i> Profile</a>
      </li>
      <li class="nav-item mb-2">
        <a href="/user/support" class="nav-link text-white opacity-75 fw-bold">
          <i class="bi bi-question-circle me-2"></i> Help & Support</a>
      </li>
      <li class="nav-item mb-2">
        <a href="/user/settings" class="nav-link text-white opacity-75 fw-bold small">
          <i class="bi bi-gear me-2"></i> Settings</a>
      </li>
      <li class="nav-item">
        <a href="/login" class="nav-link text-white opacity-75 fw-bold small">
          <i class="bi bi-box-arrow-right me-2"></i> Logout</a>
      </li>
    </ul>
  </div>
</nav>
`;

  // Some pages define this already; provide a safe default for pages that don't.
  if (typeof window.repairNav !== "function") {
    window.repairNav = function (el) {
      const repair = el && el.name ? el.name : "";
      window.location.href =
        "/user/repairs?repair=" + encodeURIComponent(repair);
    };
  }

  const scriptEl = document.currentScript;
  if (!scriptEl) return;

  scriptEl.insertAdjacentHTML("beforebegin", NAV_HTML);
  scriptEl.remove();

  // Best-effort: highlight the current page in the sidebar.
  try {
    const path = String(window.location.pathname || "");
    const file = path.split("/").filter(Boolean).pop() || "";
    const currentBase = file.replace(/\.html$/i, "");
    const aliases = new Set([currentBase]);
    if (currentBase === "bookings") aliases.add("booking");

    const nav = document.getElementById("dashboardLink")?.closest("nav");
    if (!nav) return;

    const links = nav.querySelectorAll("a.nav-link[href]");
    links.forEach((a) => a.classList.remove("active-link"));

    let active = null;
    links.forEach((a) => {
      const href = a.getAttribute("href") || "";
      const hrefBase =
        href.split("?")[0].split("#")[0].split("/").filter(Boolean).pop() || "";
      const hrefBaseNoExt = hrefBase.replace(/\.html$/i, "");
      if (aliases.has(hrefBaseNoExt)) active = a;
    });

    if (active) {
      active.classList.add("active-link");
      active.classList.remove("opacity-75");
    }
  } catch (_) {
    // Ignore; nav still renders even if the active-link logic fails.
  }
})();
