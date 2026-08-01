<script setup lang="ts">
import { SettingsSectionKey, SettingsSectionNavItem } from '../models/system-admin.model';

defineProps<{
  activeKey: SettingsSectionKey;
  featureFlagsCount?: number;
  aiProvidersCount?: number;
  apiKeysCount?: number;
}>();

const emit = defineEmits<{
  (e: 'select', key: SettingsSectionKey): void;
}>();

const navItems: SettingsSectionNavItem[] = [
  { key: 'general', label: 'General Settings', description: 'Platform branding, title, timezone, language', iconName: '⚙️' },
  { key: 'security', label: 'Security Policies', description: 'Passwords, session timeout, rate limits', iconName: '🛡️' },
  { key: 'ai-providers', label: 'AI Providers', description: 'Gemini, OpenAI, Anthropic model configurations', iconName: '🤖' },
  { key: 'feature-flags', label: 'Feature Flags', description: 'Environment feature toggles & rollouts', iconName: '🚩' },
  { key: 'integrations', label: 'Integrations', description: 'VCS repositories, Slack, webhooks', iconName: '🔌' },
  { key: 'api-keys', label: 'API Keys', description: 'Programmatic API secrets & RBAC scopes', iconName: '🔑' },
  { key: 'audit-logs', label: 'Audit Logs', description: 'Administrative action security audit log', iconName: '📜' },
  { key: 'maintenance', label: 'Maintenance Mode', description: 'System lockdown & maintenance banners', iconName: '🚧' },
  { key: 'storage', label: 'Storage', description: 'Disk partition & bucket capacity', iconName: '💾' },
  { key: 'email', label: 'Email Gateway', description: 'SMTP status & diagnostic email tests', iconName: '✉️' },
  { key: 'about', label: 'About Platform', description: 'Release versions, licenses, build hashes', iconName: 'ℹ️' },
];
</script>

<template>
  <nav class="settings-sidebar" aria-label="System Settings Sections">
    <div class="sidebar-header">
      <h3 class="sidebar-title">System Administration</h3>
      <span class="sidebar-subtitle">Platform Governance</span>
    </div>

    <div class="nav-list">
      <button
        v-for="item in navItems"
        :key="item.key"
        class="nav-item-btn"
        :class="{ active: activeKey === item.key }"
        @click="emit('select', item.key)"
      >
        <span class="nav-icon">{{ item.iconName }}</span>
        <div class="nav-text">
          <span class="nav-label">{{ item.label }}</span>
          <span class="nav-desc">{{ item.description }}</span>
        </div>
      </button>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.settings-sidebar {
  background: var(--admin-bg-surface, #ffffff);
  border: 1px solid var(--admin-border-color, #e2e8f0);
  border-radius: var(--admin-radius-md, 10px);
  padding: 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: var(--admin-shadow-sm);
  min-width: 280px;
}

.sidebar-header {
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--admin-border-color, #e2e8f0);
}

.sidebar-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--admin-text-primary, #0f172a);
  margin: 0;
}

.sidebar-subtitle {
  font-size: 0.78rem;
  color: var(--admin-text-muted, #64748b);
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.nav-item-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: transparent;
  border: 1px solid transparent;
  padding: 0.65rem 0.85rem;
  border-radius: var(--admin-radius-sm, 6px);
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: var(--admin-bg-surface-hover, #f8fafc);
  }

  &.active {
    background: var(--admin-primary-glow, rgba(37, 99, 235, 0.1));
    border-color: var(--admin-primary, #2563eb);

    .nav-label {
      color: var(--admin-primary, #2563eb);
    }
  }
}

.nav-icon {
  font-size: 1.1rem;
}

.nav-text {
  display: flex;
  flex-direction: column;
}

.nav-label {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--admin-text-primary, #0f172a);
}

.nav-desc {
  font-size: 0.73rem;
  color: var(--admin-text-muted, #64748b);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 190px;
}
</style>
