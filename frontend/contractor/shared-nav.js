// Shared sidebar navigation for all pages in `frontend/contractor`.
// Usage: replace the per-page <aside.sidebar> + #sidebarOverlay markup with:
//   <script src="/contractor/shared-nav.js"></script>
// The sidebar is injected exactly where the script tag appears.

(function () {
  const SIDEBAR_HTML = `
  <!-- SIDEBAR (shared) -->
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-header">
      <div class="sidebar-logo">
        <div class="logo-mark">CP</div>
        <div class="sidebar-logo-text">
          <strong>ContractorHub</strong>
          <small>Contractor Portal</small>
        </div>
      </div>
      <button class="toggle-btn" id="sidebarToggle" title="Toggle Sidebar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <path d="M15 18l-6-6 6-6"></path>
        </svg>
      </button>
    </div>

    <div class="sidebar-user">
      <div class="user-avatar-wrap">
        <img class="user-avatar" id="sidebarAvatar" src="" alt="" style="display:none"/>
        <div class="user-avatar-fallback" id="sidebarAvatarFallback">JD</div>
        <span class="status-dot"></span>
      </div>
      <div class="user-info">
        <div class="user-name" id="sidebarUserName">Juan dela Cruz</div>
        <div class="user-role" id="sidebarUserRole">Contractor</div>
      </div>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-section-label">Main</div>
      <a href="/contract/" class="nav-item" data-page="contractor_dashboard.html">
        <span class="nav-icon">🏠</span>
        <span class="sidebar-label">Dashboard</span>
        <span class="nav-tooltip">Dashboard</span>
      </a>
      <a href="/contract/bookings" class="nav-item" data-page="contractor_bookings.html">
        <span class="nav-icon">📋</span>
        <span class="sidebar-label">Bookings</span>
        <span class="nav-badge" id="bookingsBadge">0</span>
        <span class="nav-tooltip">Bookings</span>
      </a>
      <a href="/contract/messages" class="nav-item" data-page="contractor_messages.html">
        <span class="nav-icon">💬</span>
        <span class="sidebar-label">Messages</span>
        <span class="nav-badge" id="messagesBadge">0</span>
        <span class="nav-tooltip">Messages</span>
      </a>
      <a href="/contract/calendar" class="nav-item" data-page="contractor_calendar.html">
        <span class="nav-icon">📅</span>
        <span class="sidebar-label">Calendar</span>
        <span class="nav-tooltip">Calendar</span>
      </a>

      <div class="nav-section-label">Account</div>
      <a href="/contract/profile" class="nav-item" data-page="contractor_profile.html">
        <span class="nav-icon">👤</span>
        <span class="sidebar-label">Profile</span>
        <span class="nav-tooltip">Profile</span>
      </a>
      <a href="/contract/settings" class="nav-item" data-page="contractor_settings.html">
        <span class="nav-icon">⚙️</span>
        <span class="sidebar-label">Settings</span>
        <span class="nav-tooltip">Settings</span>
      </a>

      <div class="divider"></div>
      <button class="nav-item nav-logout" onclick="handleLogout(event)">
        <span class="nav-icon">🚪</span>
        <span class="sidebar-label">Log Out</span>
        <span class="nav-tooltip">Log Out</span>
      </button>
    </nav>

    <div class="sidebar-footer">
      <div class="sidebar-footer-text">ContractorHub v2.0 © 2026</div>
    </div>
  </aside>
  <div class="sidebar-overlay" id="sidebarOverlay"></div>
`;

  const scriptEl = document.currentScript;
  if (!scriptEl) return;

  scriptEl.insertAdjacentHTML("beforebegin", SIDEBAR_HTML);
  scriptEl.remove();
})();

