<template>
  <div class="top-repositories-panel">
    <div class="panel-header">
      <div class="header-title-group">
        <h3 class="panel-title">Top Inspected Repositories</h3>
        <p class="panel-subtitle">Most active codebase repositories in automated review queue</p>
      </div>
      <button class="view-all-btn">View All Repositories</button>
    </div>

    <div class="table-container">
      <table class="repo-table">
        <thead>
          <tr>
            <th>Repository</th>
            <th>Primary Stack</th>
            <th>Total Reviews</th>
            <th>Quality Score</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="repo in repositories" :key="repo.id">
            <td class="repo-name-col">
              <div class="repo-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              </div>
              <div class="repo-info">
                <span class="repo-name">{{ repo.name }}</span>
                <span class="repo-branch">{{ repo.branch }}</span>
              </div>
            </td>
            <td>
              <span class="lang-tag" :class="repo.language.toLowerCase()">{{ repo.language }}</span>
            </td>
            <td class="reviews-col">{{ repo.reviewsCount }} scans</td>
            <td>
              <div class="score-badge" :class="getScoreClass(repo.qualityScore)">
                <span>{{ repo.qualityScore }}/100</span>
              </div>
            </td>
            <td>
              <span class="status-pill healthy">
                <span class="status-dot"></span>
                Active
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface RepositoryItem {
  id: string;
  name: string;
  branch: string;
  language: string;
  reviewsCount: number;
  qualityScore: number;
}

const repositories = ref<RepositoryItem[]>([
  { id: 'r1', name: 'codelens/backend-api', branch: 'main', language: 'TypeScript', reviewsCount: 342, qualityScore: 96 },
  { id: 'r2', name: 'codelens/frontend-angular', branch: 'main', language: 'TypeScript', reviewsCount: 218, qualityScore: 92 },
  { id: 'r3', name: 'codelens/vue-admin-portal', branch: 'main', language: 'Vue', reviewsCount: 185, qualityScore: 98 },
  { id: 'r4', name: 'codelens/ai-analysis-service', branch: 'main', language: 'Python', reviewsCount: 142, qualityScore: 94 },
  { id: 'r5', name: 'codelens/infrastructure-cdk', branch: 'main', language: 'Go', reviewsCount: 79, qualityScore: 90 },
]);

function getScoreClass(score: number): string {
  if (score >= 95) return 'score-excellent';
  if (score >= 85) return 'score-good';
  return 'score-average';
}
</script>

<style scoped>
.top-repositories-panel {
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

.view-all-btn {
  background: none;
  border: 1px solid var(--admin-border-color);
  color: var(--admin-text-secondary);
  padding: 0.375rem 0.75rem;
  border-radius: var(--admin-radius-md);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.view-all-btn:hover {
  background-color: var(--admin-bg-app);
  color: var(--admin-primary);
}

.table-container {
  overflow-x: auto;
}

.repo-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.8125rem;
}

.repo-table th {
  padding: 0.625rem 0.75rem;
  color: var(--admin-text-muted);
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  border-bottom: 1px solid var(--admin-border-color);
}

.repo-table td {
  padding: 0.75rem;
  border-bottom: 1px solid var(--admin-border-color);
  color: var(--admin-text-primary);
}

.repo-table tr:last-child td {
  border-bottom: none;
}

.repo-name-col {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.repo-icon {
  width: 32px;
  height: 32px;
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--admin-primary);
  border-radius: var(--admin-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.repo-info {
  display: flex;
  flex-direction: column;
}

.repo-name {
  font-weight: 600;
  color: var(--admin-text-primary);
}

.repo-branch {
  font-size: 0.75rem;
  color: var(--admin-text-muted);
}

.lang-tag {
  display: inline-block;
  padding: 0.1875rem 0.5rem;
  border-radius: var(--admin-radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  background-color: var(--admin-bg-app);
}

.reviews-col {
  font-weight: 600;
  color: var(--admin-text-secondary);
}

.score-badge {
  display: inline-block;
  padding: 0.1875rem 0.5rem;
  border-radius: var(--admin-radius-full);
  font-size: 0.75rem;
  font-weight: 700;
}

.score-excellent {
  background-color: rgba(16, 185, 129, 0.12);
  color: #10b981;
}

.score-good {
  background-color: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
}

.score-average {
  background-color: rgba(245, 158, 11, 0.12);
  color: #f59e0b;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #10b981;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #10b981;
}
</style>
