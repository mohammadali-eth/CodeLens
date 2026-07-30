<template>
  <div class="log-viewer">
    <div class="log-header">
      <div class="log-title-group">
        <h4 class="log-title">Processing & Execution Logs</h4>
        <span class="log-count">{{ logs.length }} log entries</span>
      </div>
      <div class="log-actions">
        <button type="button" class="btn-copy" title="Copy All Logs" @click="copyLogs">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
          Copy
        </button>
      </div>
    </div>

    <div class="log-terminal">
      <div v-if="logs.length === 0" class="no-logs">
        No execution logs recorded for this review.
      </div>
      <div v-else class="log-lines">
        <div
          v-for="log in logs"
          :key="log.id"
          class="log-line"
          :class="`level-${log.level}`"
        >
          <span class="log-time">{{ formatTime(log.timestamp) }}</span>
          <span class="log-level-badge" :class="`badge-${log.level}`">[{{ log.level.toUpperCase() }}]</span>
          <span v-if="log.phase" class="log-phase">[{{ log.phase }}]</span>
          <span class="log-msg">{{ log.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProcessingLog } from '../models/review.model';

const props = defineProps<{
  logs: ProcessingLog[];
}>();

function formatTime(iso: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function copyLogs() {
  const text = props.logs
    .map((l) => `[${l.timestamp}] [${l.level.toUpperCase()}] ${l.phase ? `[${l.phase}] ` : ''}${l.message}`)
    .join('\n');
  navigator.clipboard.writeText(text);
}
</script>

<style scoped>
.log-viewer {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.log-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.log-title-group {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.log-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--admin-text-secondary, #94a3b8);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.log-count {
  font-size: 0.75rem;
  color: var(--admin-text-secondary, #94a3b8);
}

.btn-copy {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--admin-border-color, #334155);
  background-color: var(--admin-bg-primary, #0f172a);
  color: var(--admin-text-secondary, #94a3b8);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    color: var(--admin-text-primary, #f8fafc);
    border-color: #3b82f6;
  }

  svg {
    width: 0.875rem;
    height: 0.875rem;
  }
}

.log-terminal {
  background-color: #090d16;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 1rem;
  font-family: 'Fira Code', monospace, Consolas;
  font-size: 0.8125rem;
  max-height: 320px;
  overflow-y: auto;
}

.no-logs {
  color: #64748b;
  font-style: italic;
}

.log-lines {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.log-line {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  line-height: 1.4;
}

.log-time {
  color: #64748b;
  font-size: 0.75rem;
}

.log-level-badge {
  font-weight: 700;
  font-size: 0.75rem;
}

.badge-info { color: #3b82f6; }
.badge-warn { color: #f59e0b; }
.badge-error { color: #ef4444; }

.log-phase {
  color: #a78bfa;
  font-size: 0.75rem;
}

.log-msg {
  color: #e2e8f0;
  word-break: break-word;
}
</style>
