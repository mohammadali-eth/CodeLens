<template>
  <footer class="admin-footer">
    <div class="footer-left">
      <span>CodeLens AI Admin Portal &copy; 2026</span>
    </div>
    <div class="footer-right">
      <span class="status-indicator">
        <span class="status-dot"></span> System Operational
      </span>
      <span class="version-tag">v1.0.0</span>
    </div>
  </footer>
</template>

<script setup lang="ts"></script>

<style scoped>
.admin-footer {
  height: 48px;
  background-color: var(--admin-bg-surface);
  border-top: 1px solid var(--admin-border-color);
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--admin-text-muted);
}
.footer-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: #10b981;
  font-weight: 500;
}
.status-dot {
  width: 6px;
  height: 6px;
  background-color: #10b981;
  border-radius: 50%;
}
.version-tag {
  font-family: monospace;
  background-color: var(--admin-bg-app);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid var(--admin-border-color);
}
</style>
