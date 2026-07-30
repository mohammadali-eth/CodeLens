<template>
  <div v-if="isOpen" class="drawer-backdrop" @click="close">
    <div class="drawer-content" @click.stop>
      <!-- Drawer Header -->
      <div class="drawer-header">
        <div class="header-main">
          <div class="header-title-group">
            <span class="drawer-tag">Review Detail</span>
            <h2 class="drawer-title">{{ review?.title || 'Code Review Overview' }}</h2>
          </div>
          <div v-if="review" class="header-badges">
            <ReviewStatusBadge :status="review.status" />
            <QualityScoreBadge :score="review.score" />
          </div>
        </div>

        <button type="button" class="close-btn" aria-label="Close drawer" @click="close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Action Toolbar -->
      <div v-if="review" class="drawer-toolbar">
        <div class="toolbar-left">
          <button type="button" class="tb-btn" title="Re-run Review" @click="$emit('rerun', review.id)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Re-run
          </button>
          <button type="button" class="tb-btn" title="Download Report" @click="$emit('download-report', review.id)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Report
          </button>
          <button type="button" class="tb-btn" :title="review.isArchived ? 'Restore Review' : 'Archive Review'" @click="$emit('archive-toggle', review.id)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 01-2-2V4a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 01-2 2M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>
            {{ review.isArchived ? 'Restore' : 'Archive' }}
          </button>
        </div>

        <div class="toolbar-right">
          <button type="button" class="tb-btn tb-danger" title="Delete Review" @click="$emit('delete', review.id)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            Delete
          </button>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="drawer-tabs">
        <button
          type="button"
          class="tab-btn"
          :class="{ active: activeTab === 'overview' }"
          @click="activeTab = 'overview'"
        >
          Overview & AI Summary
        </button>
        <button
          type="button"
          class="tab-btn"
          :class="{ active: activeTab === 'code' }"
          @click="activeTab = 'code'"
        >
          Code & Diff ({{ review?.files?.length || 0 }})
        </button>
        <button
          type="button"
          class="tab-btn"
          :class="{ active: activeTab === 'logs' }"
          @click="activeTab = 'logs'"
        >
          Logs ({{ review?.processingLogs?.length || 0 }})
        </button>
        <button
          type="button"
          class="tab-btn"
          :class="{ active: activeTab === 'moderation' }"
          @click="activeTab = 'moderation'"
        >
          Moderation
        </button>
      </div>

      <!-- Drawer Body -->
      <div class="drawer-body">
        <!-- Loading State -->
        <div v-if="isLoading" class="drawer-loading">
          <div class="spinner"></div>
          <span>Loading review metadata & diff inspection...</span>
        </div>

        <template v-else-if="review">
          <!-- Overview Tab -->
          <div v-if="activeTab === 'overview'" class="tab-pane">
            <!-- AI Summary Card -->
            <div class="summary-card">
              <h4 class="card-subtitle">AI Executive Summary</h4>
              <p class="summary-text">{{ review.summary }}</p>
            </div>

            <!-- Issues Count Grid -->
            <div class="issues-metric-grid">
              <div class="issue-card bg-bugs">
                <span class="ic-count">{{ review.bugsCount }}</span>
                <span class="ic-label">Bugs Found</span>
              </div>
              <div class="issue-card bg-errors">
                <span class="ic-count">{{ review.errorsCount }}</span>
                <span class="ic-label">Errors</span>
              </div>
              <div class="issue-card bg-practices">
                <span class="ic-count">{{ review.bestPracticesCount }}</span>
                <span class="ic-label">Best Practices</span>
              </div>
              <div class="issue-card bg-optims">
                <span class="ic-count">{{ review.optimizationsCount }}</span>
                <span class="ic-label">Optimizations</span>
              </div>
            </div>

            <!-- Quality Metrics Breakdown -->
            <div class="quality-breakdown">
              <h4 class="card-subtitle">Quality Metrics Breakdown</h4>
              <div class="metrics-grid">
                <div class="metric-row">
                  <span class="m-label">Readability</span>
                  <div class="m-bar-wrapper">
                    <div class="m-bar bg-blue" :style="{ width: `${review.qualityMetrics?.readability || 85}%` }"></div>
                  </div>
                  <span class="m-val">{{ review.qualityMetrics?.readability || 85 }}%</span>
                </div>
                <div class="metric-row">
                  <span class="m-label">Maintainability</span>
                  <div class="m-bar-wrapper">
                    <div class="m-bar bg-green" :style="{ width: `${review.qualityMetrics?.maintainability || 80}%` }"></div>
                  </div>
                  <span class="m-val">{{ review.qualityMetrics?.maintainability || 80 }}%</span>
                </div>
                <div class="metric-row">
                  <span class="m-label">Security</span>
                  <div class="m-bar-wrapper">
                    <div class="m-bar bg-amber" :style="{ width: `${review.qualityMetrics?.security || 90}%` }"></div>
                  </div>
                  <span class="m-val">{{ review.qualityMetrics?.security || 90 }}%</span>
                </div>
                <div class="metric-row">
                  <span class="m-label">Performance</span>
                  <div class="m-bar-wrapper">
                    <div class="m-bar bg-purple" :style="{ width: `${review.qualityMetrics?.performance || 78}%` }"></div>
                  </div>
                  <span class="m-val">{{ review.qualityMetrics?.performance || 78 }}%</span>
                </div>
              </div>
            </div>

            <!-- Metadata Specs Panel -->
            <ReviewMetadataPanel :review="review" />
          </div>

          <!-- Code & Diff Tab -->
          <div v-else-if="activeTab === 'code'" class="tab-pane">
            <div v-if="!review.files || review.files.length === 0" class="no-files">
              No files uploaded for diff analysis.
            </div>
            <div v-else class="diff-viewer-container">
              <!-- File Selector Header -->
              <div class="file-selector">
                <label class="fs-label">Selected File:</label>
                <select v-model="selectedFileId" class="fs-select">
                  <option v-for="f in review.files" :key="f.id" :value="f.id">
                    {{ f.filename }} ({{ f.issues?.length || 0 }} issues)
                  </option>
                </select>
              </div>

              <!-- Side by Side Diff Viewer -->
              <div v-if="activeFile" class="diff-grid">
                <!-- Original Code -->
                <div class="diff-col">
                  <div class="diff-col-header">
                    <span class="col-title">Original Code</span>
                    <span class="file-lang-pill">{{ activeFile.language }}</span>
                  </div>
                  <pre class="code-block"><code>{{ activeFile.originalCode }}</code></pre>
                </div>

                <!-- Improved Code -->
                <div class="diff-col col-improved">
                  <div class="diff-col-header">
                    <span class="col-title">AI Suggested Improvements</span>
                    <span class="diff-badge">Refactored</span>
                  </div>
                  <pre class="code-block"><code>{{ activeFile.improvedCode || activeFile.originalCode }}</code></pre>
                </div>
              </div>

              <!-- File Issues List -->
              <div v-if="activeFile && activeFile.issues && activeFile.issues.length > 0" class="file-issues-panel">
                <h4 class="card-subtitle">Identified Code Issues ({{ activeFile.issues.length }})</h4>
                <div class="issues-list">
                  <div v-for="iss in activeFile.issues" :key="iss.id" class="issue-item" :class="`severity-${iss.severity.toLowerCase()}`">
                    <div class="issue-item-header">
                      <span class="issue-cat">{{ iss.category }}</span>
                      <span class="issue-sev">[{{ iss.severity }}]</span>
                      <span class="issue-title">{{ iss.title }}</span>
                      <span v-if="iss.lineStart" class="issue-line">Lines {{ iss.lineStart }}-{{ iss.lineEnd || iss.lineStart }}</span>
                    </div>
                    <p class="issue-desc">{{ iss.description }}</p>
                    <div v-if="iss.suggestion" class="issue-sugg">
                      <strong>Suggestion:</strong> {{ iss.suggestion }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Logs Tab -->
          <div v-else-if="activeTab === 'logs'" class="tab-pane">
            <ProcessingLogViewer :logs="review.processingLogs || []" />
          </div>

          <!-- Moderation Tab -->
          <div v-else-if="activeTab === 'moderation'" class="tab-pane">
            <ModeratorNotesPanel
              :review="review"
              :is-saving="isModerating"
              @save="$emit('save-moderation', $event)"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { AdminReviewDetail } from '../models/review.model';
import ReviewStatusBadge from './ReviewStatusBadge.vue';
import QualityScoreBadge from './QualityScoreBadge.vue';
import ReviewMetadataPanel from './ReviewMetadataPanel.vue';
import ProcessingLogViewer from './ProcessingLogViewer.vue';
import ModeratorNotesPanel from './ModeratorNotesPanel.vue';

const props = defineProps<{
  isOpen: boolean;
  review: AdminReviewDetail | null;
  isLoading?: boolean;
  isModerating?: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'rerun', id: string): void;
  (e: 'download-report', id: string): void;
  (e: 'archive-toggle', id: string): void;
  (e: 'delete', id: string): void;
  (e: 'save-moderation', payload: { isFlagged: boolean; isHidden: boolean; moderatorNotes: string }): void;
}>();

const activeTab = ref<'overview' | 'code' | 'logs' | 'moderation'>('overview');
const selectedFileId = ref<string>('');

const activeFile = computed(() => {
  if (!props.review?.files) return null;
  return props.review.files.find((f) => f.id === selectedFileId.value) || props.review.files[0] || null;
});

watch(
  () => props.review,
  (newRev) => {
    if (newRev && newRev.files && newRev.files.length > 0) {
      selectedFileId.value = newRev.files[0].id;
    }
  },
  { immediate: true }
);

function close() {
  emit('close');
}
</script>

<style scoped>
.drawer-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  justify-content: flex-end;
}

.drawer-content {
  width: 100%;
  max-width: 840px;
  height: 100%;
  background-color: var(--admin-bg-surface);
  border-left: 1px solid var(--admin-border-color);
  display: flex;
  flex-direction: column;
  box-shadow: var(--admin-shadow-lg);
  animation: slideIn 0.25s ease-out;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.drawer-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--admin-border-color);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.header-main {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.header-title-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.drawer-tag {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--admin-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.drawer-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--admin-text-primary);
  margin: 0;
}

.header-badges {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.close-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: var(--admin-radius-md);
  border: 1px solid var(--admin-border-color);
  background: transparent;
  color: var(--admin-text-muted);
  cursor: pointer;

  &:hover {
    color: var(--admin-text-primary);
    border-color: var(--admin-primary);
  }

  svg {
    width: 1.125rem;
    height: 1.125rem;
  }
}

.drawer-toolbar {
  padding: 0.75rem 1.5rem;
  background-color: var(--admin-bg-app);
  border-bottom: 1px solid var(--admin-border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.toolbar-left, .toolbar-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tb-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: var(--admin-radius-md);
  border: 1px solid var(--admin-border-color);
  background-color: var(--admin-bg-surface);
  color: var(--admin-text-primary);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    border-color: var(--admin-primary);
    color: var(--admin-primary);
  }

  &.tb-danger:hover {
    border-color: #ef4444;
    color: #ef4444;
  }

  svg {
    width: 0.875rem;
    height: 0.875rem;
  }
}

.drawer-tabs {
  display: flex;
  border-bottom: 1px solid var(--admin-border-color);
  padding: 0 1.5rem;
  background-color: var(--admin-bg-app);
}

.tab-btn {
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  color: var(--admin-text-muted);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;

  &:hover {
    color: var(--admin-text-primary);
  }

  &.active {
    color: var(--admin-primary);
    border-bottom-color: var(--admin-primary);
  }
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.tab-pane {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.drawer-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
  color: var(--admin-text-muted);
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid rgba(59, 130, 246, 0.2);
  border-top-color: var(--admin-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.summary-card {
  background-color: var(--admin-bg-app);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  padding: 1rem 1.25rem;
}

.card-subtitle {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--admin-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 0.5rem 0;
}

.summary-text {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--admin-text-primary);
  margin: 0;
}

.issues-metric-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.issue-card {
  padding: 0.75rem;
  border-radius: var(--admin-radius-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
}

.ic-count {
  font-size: 1.5rem;
  font-weight: 800;
}

.ic-label {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
}

.bg-bugs { background-color: rgba(239, 68, 68, 0.12); color: #ef4444; border-color: rgba(239, 68, 68, 0.2); }
.bg-errors { background-color: rgba(245, 158, 11, 0.12); color: #f59e0b; border-color: rgba(245, 158, 11, 0.2); }
.bg-practices { background-color: rgba(59, 130, 246, 0.12); color: #3b82f6; border-color: rgba(59, 130, 246, 0.2); }
.bg-optims { background-color: rgba(16, 185, 129, 0.12); color: #10b981; border-color: rgba(16, 185, 129, 0.2); }

.quality-breakdown {
  background-color: var(--admin-bg-app);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  padding: 1rem 1.25rem;
}

.metrics-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.metric-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.m-label {
  width: 110px;
  font-size: 0.8125rem;
  color: var(--admin-text-secondary);
  font-weight: 500;
}

.m-bar-wrapper {
  flex: 1;
  height: 0.5rem;
  background-color: var(--admin-bg-surface);
  border-radius: 9999px;
  overflow: hidden;
}

.m-bar {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.4s ease;
}

.bg-blue { background-color: #3b82f6; }
.bg-green { background-color: #10b981; }
.bg-amber { background-color: #f59e0b; }
.bg-purple { background-color: #8b5cf6; }

.m-val {
  width: 40px;
  text-align: right;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--admin-text-primary);
}

/* Diff Viewer */
.file-selector {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.fs-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--admin-text-secondary);
}

.fs-select {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border-radius: var(--admin-radius-md);
  border: 1px solid var(--admin-border-color);
  background-color: var(--admin-bg-app);
  color: var(--admin-text-primary);
  font-size: 0.875rem;
}

.diff-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.diff-col {
  background-color: #090d16;
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  overflow: hidden;
}

.diff-col-header {
  padding: 0.5rem 0.75rem;
  background-color: #0f172a;
  border-bottom: 1px solid #1e293b;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.col-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
}

.file-lang-pill, .diff-badge {
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  background-color: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.code-block {
  margin: 0;
  padding: 0.875rem;
  font-family: var(--admin-font-mono);
  font-size: 0.8125rem;
  color: #e2e8f0;
  overflow-x: auto;
  line-height: 1.5;
}

.file-issues-panel {
  margin-top: 1.25rem;
  background-color: var(--admin-bg-app);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  padding: 1rem;
}

.issues-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.issue-item {
  padding: 0.75rem;
  border-radius: var(--admin-radius-md);
  background-color: var(--admin-bg-surface);
  border-left: 4px solid var(--admin-text-muted);
}

.severity-critical { border-left-color: #ef4444; }
.severity-high { border-left-color: #f97316; }
.severity-medium { border-left-color: #f59e0b; }
.severity-low { border-left-color: #3b82f6; }

.issue-item-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.375rem;
}

.issue-cat {
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--admin-primary);
}

.issue-sev {
  font-size: 0.6875rem;
  font-weight: 700;
}

.issue-title {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--admin-text-primary);
}

.issue-line {
  font-size: 0.6875rem;
  color: var(--admin-text-muted);
  margin-left: auto;
}

.issue-desc {
  font-size: 0.8125rem;
  color: var(--admin-text-secondary);
  margin: 0 0 0.375rem 0;
}

.issue-sugg {
  font-size: 0.75rem;
  color: #10b981;
  background-color: rgba(16, 185, 129, 0.1);
  padding: 0.375rem 0.5rem;
  border-radius: 4px;
}
</style>
