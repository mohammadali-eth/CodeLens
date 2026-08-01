<script setup lang="ts">
import { SystemLogEntry, LogCategory } from '../models/monitoring.model';

defineProps<{
  logs: SystemLogEntry[];
  activeCategory: LogCategory;
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'selectCategory', category: LogCategory): void;
}>();

const categories: LogCategory[] = ['application', 'queue', 'security', 'database', 'ai'];

const logLevelClass = (level: string) => {
  switch (level) {
    case 'error':
      return 'lvl-error';
    case 'warn':
      return 'lvl-warn';
    case 'debug':
      return 'lvl-debug';
    default:
      return 'lvl-info';
  }
};
</script>

<template>
  <div class="log-preview-panel">
    <div class="panel-header">
      <div class="header-left">
        <h3 class="panel-title">System Execution & Audit Log Console</h3>
        <span class="header-subtitle">Read-only live stream of backend application, database, and security logs</span>
      </div>

      <!-- Category Filter Tabs -->
      <div class="log-tabs">
        <button
          v-for="cat in categories"
          :key="cat"
          class="tab-btn"
          :class="{ active: activeCategory === cat }"
          @click="emit('selectCategory', cat)"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Terminal Window Container -->
    <div class="terminal-window">
      <div class="terminal-header">
        <div class="window-buttons">
          <span class="btn red"></span>
          <span class="btn yellow"></span>
          <span class="btn green"></span>
        </div>
        <span class="terminal-title">bash - codelens-backend.log [{{ activeCategory }}]</span>
      </div>

      <div v-if="isLoading" class="terminal-loading">
        <span class="cursor-pulse">> Loading telemetry logs...</span>
      </div>

      <div v-else-if="logs.length === 0" class="terminal-empty">
        <span>> No recent logs found for category [{{ activeCategory }}].</span>
      </div>

      <div v-else class="terminal-content">
        <div v-for="entry in logs" :key="entry.id" class="log-line">
          <span class="log-time">{{ new Date(entry.timestamp).toLocaleTimeString() }}</span>
          <span class="log-lvl" :class="logLevelClass(entry.level)">[{{ entry.level.toUpperCase() }}]</span>
          <span class="log-source">[{{ entry.source }}]</span>
          <span class="log-msg">{{ entry.message }}</span>
          <span v-if="entry.meta" class="log-meta">{{ JSON.stringify(entry.meta) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.log-preview-panel {
  background: var(--admin-bg-surface, #1e293b);
  border: 1px solid var(--admin-border-color, #334155);
  border-radius: 12px;
  padding: 1.5rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.panel-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--admin-text-primary, #f8fafc);
  margin: 0;
}

.header-subtitle {
  font-size: 0.85rem;
  color: var(--admin-text-secondary, #94a3b8);
}

.log-tabs {
  display: flex;
  background: rgba(15, 23, 42, 0.6);
  padding: 0.2rem;
  border-radius: 8px;

  .tab-btn {
    background: transparent;
    border: none;
    color: var(--admin-text-secondary, #94a3b8);
    font-size: 0.78rem;
    font-weight: 600;
    padding: 0.35rem 0.75rem;
    border-radius: 6px;
    cursor: pointer;
    text-transform: capitalize;
    transition: all 0.2s ease;

    &.active {
      background: var(--admin-primary-color, #3b82f6);
      color: #ffffff;
    }
  }
}

.terminal-window {
  background: #090d16;
  border: 1px solid #1e293b;
  border-radius: 8px;
  overflow: hidden;
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
}

.terminal-header {
  background: #0f172a;
  padding: 0.5rem 0.85rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid #1e293b;
}

.window-buttons {
  display: flex;
  gap: 0.35rem;

  .btn {
    width: 10px;
    height: 10px;
    border-radius: 50%;

    &.red { background: #ef4444; }
    &.yellow { background: #f59e0b; }
    &.green { background: #10b981; }
  }
}

.terminal-title {
  font-size: 0.75rem;
  color: #64748b;
}

.terminal-content {
  padding: 0.85rem;
  max-height: 240px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.log-line {
  font-size: 0.8rem;
  line-height: 1.4;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.log-time { color: #64748b; }
.log-source { color: #38bdf8; }
.log-msg { color: #e2e8f0; }
.log-meta { color: #94a3b8; font-size: 0.75rem; font-style: italic; }

.log-lvl {
  font-weight: 700;
  &.lvl-info { color: #3b82f6; }
  &.lvl-warn { color: #f59e0b; }
  &.lvl-error { color: #ef4444; }
  &.lvl-debug { color: #a855f7; }
}

.terminal-loading, .terminal-empty {
  padding: 1.5rem;
  font-size: 0.82rem;
  color: #94a3b8;
}

.cursor-pulse {
  animation: pulse 1.2s infinite;
}

@keyframes pulse {
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
}
</style>
