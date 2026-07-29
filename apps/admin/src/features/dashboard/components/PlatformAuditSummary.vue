<template>
  <div class="platform-audit-summary">
    <div class="panel-header">
      <div class="header-title-group">
        <h3 class="panel-title">Security & Compliance Audit Summary</h3>
        <p class="panel-subtitle">Real-time enterprise authorization & guard status</p>
      </div>
      <span class="compliance-badge">100% COMPLIANT</span>
    </div>

    <div class="audit-grid">
      <div class="audit-card">
        <div class="audit-icon success">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        </div>
        <div class="audit-details">
          <span class="audit-label">JWT Token Security</span>
          <span class="audit-status">Active (256-bit RS256 Signature)</span>
        </div>
      </div>

      <div class="audit-card">
        <div class="audit-icon success">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <div class="audit-details">
          <span class="audit-label">RBAC Authorization</span>
          <span class="audit-status">Strict Granular Permission Checks</span>
        </div>
      </div>

      <div class="audit-card">
        <div class="audit-icon info">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
        </div>
        <div class="audit-details">
          <span class="audit-label">DB Connection Pool</span>
          <span class="audit-status">14 / 50 Active Connections</span>
        </div>
      </div>

      <div class="audit-card">
        <div class="audit-icon info">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <div class="audit-details">
          <span class="audit-label">System Uptime</span>
          <span class="audit-status">99.98% High Availability</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.platform-audit-summary {
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-lg);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.compliance-badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: #10b981;
  background-color: rgba(16, 185, 129, 0.12);
  padding: 0.25rem 0.625rem;
  border-radius: var(--admin-radius-full);
}

.audit-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (max-width: 640px) {
  .audit-grid {
    grid-template-columns: 1fr;
  }
}

.audit-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background-color: var(--admin-bg-app);
  border-radius: var(--admin-radius-md);
  border: 1px solid var(--admin-border-color);
}

.audit-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: var(--admin-radius-md);
  flex-shrink: 0;
}

.audit-icon.success {
  background-color: rgba(16, 185, 129, 0.12);
  color: #10b981;
}

.audit-icon.info {
  background-color: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
}

.audit-details {
  display: flex;
  flex-direction: column;
}

.audit-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--admin-text-primary);
}

.audit-status {
  font-size: 0.75rem;
  color: var(--admin-text-muted);
}
</style>
