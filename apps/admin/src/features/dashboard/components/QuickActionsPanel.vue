<template>
  <div class="quick-actions-panel">
    <div class="panel-header">
      <h3 class="panel-title">Quick Administration Actions</h3>
      <p class="panel-subtitle">Shortcuts to common administrative tasks</p>
    </div>

    <div class="actions-grid">
      <router-link to="/users" class="action-btn">
        <div class="action-icon users">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <span class="action-text">Manage Users</span>
      </router-link>

      <router-link to="/reviews" class="action-btn">
        <div class="action-icon reviews">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        </div>
        <span class="action-text">View Reviews</span>
      </router-link>

      <router-link to="/audit-logs" class="action-btn">
        <div class="action-icon audit">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
        </div>
        <span class="action-text">Audit Logs</span>
      </router-link>

      <router-link to="/analytics" class="action-btn">
        <div class="action-icon analytics">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
        </div>
        <span class="action-text">Analytics</span>
      </router-link>

      <router-link to="/reports" class="action-btn">
        <div class="action-icon reports">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
            <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
          </svg>
        </div>
        <span class="action-text">Reports</span>
      </router-link>

      <router-link to="/system" class="action-btn">
        <div class="action-icon system">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </div>
        <span class="action-text">System Settings</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// QuickActionsPanel component
</script>

<style scoped>
.quick-actions-panel {
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-lg);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.panel-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--admin-text-primary);
  margin: 0;
}

.panel-subtitle {
  font-size: 0.8125rem;
  color: var(--admin-text-muted);
  margin: 0.25rem 0 0 0;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 0.5rem;
  background-color: var(--admin-bg-app);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  text-decoration: none;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background-color: var(--admin-border-color);
  transform: translateY(-2px);
}

.action-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: var(--admin-radius-md);
}

.action-icon.users { background-color: rgba(37, 99, 235, 0.12); color: #3b82f6; }
.action-icon.reviews { background-color: rgba(16, 185, 129, 0.12); color: #10b981; }
.action-icon.audit { background-color: rgba(139, 92, 246, 0.12); color: #8b5cf6; }
.action-icon.analytics { background-color: rgba(6, 182, 212, 0.12); color: #06b6d4; }
.action-icon.reports { background-color: rgba(245, 158, 11, 0.12); color: #f59e0b; }
.action-icon.system { background-color: rgba(236, 72, 153, 0.12); color: #ec4899; }

.action-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--admin-text-primary);
  text-align: center;
}
</style>
