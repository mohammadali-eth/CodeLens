<template>
  <div class="filter-panel">
    <div class="filter-main-row">
      <!-- Search Input -->
      <div class="search-wrapper">
        <SearchBar
          :model-value="store.filters.search"
          placeholder="Search by Review ID, title, user, file, language..."
          @update:model-value="onSearchChange"
        />
      </div>

      <!-- Filters Group -->
      <div class="controls-group">
        <!-- Status Selector -->
        <div class="filter-item">
          <label class="filter-label">Status</label>
          <select
            :value="store.filters.status"
            class="filter-select"
            @change="onStatusChange"
          >
            <option value="ALL">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="PROCESSING">Processing</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <!-- AI Provider Selector -->
        <div class="filter-item">
          <label class="filter-label">AI Provider</label>
          <select
            :value="store.filters.aiProvider"
            class="filter-select"
            @change="onProviderChange"
          >
            <option value="ALL">All AI Providers</option>
            <option value="GEMINI">Google Gemini</option>
            <option value="OPENAI">OpenAI GPT-4o</option>
            <option value="ANTHROPIC">Anthropic Claude</option>
            <option value="DEEPSEEK">DeepSeek R1</option>
          </select>
        </div>

        <!-- Language Selector -->
        <div class="filter-item">
          <label class="filter-label">Language</label>
          <select
            :value="store.filters.language"
            class="filter-select"
            @change="onLanguageChange"
          >
            <option value="ALL">All Languages</option>
            <option value="typescript">TypeScript</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
            <option value="java">Java</option>
            <option value="csharp">C#</option>
          </select>
        </div>

        <!-- Sort By Selector -->
        <div class="filter-item">
          <label class="filter-label">Sort By</label>
          <select
            :value="`${store.filters.sortBy}:${store.filters.sortOrder}`"
            class="filter-select"
            @change="onSortChange"
          >
            <option value="createdAt:desc">Newest First</option>
            <option value="createdAt:asc">Oldest First</option>
            <option value="score:desc">Highest Quality</option>
            <option value="score:asc">Lowest Quality</option>
            <option value="processingTimeMs:desc">Highest Latency</option>
          </select>
        </div>

        <!-- Failed Only Toggle -->
        <div class="filter-checkbox-item">
          <label class="checkbox-label">
            <input
              type="checkbox"
              :checked="store.filters.failedOnly"
              class="checkbox-input"
              @change="onFailedToggle"
            />
            <span>Failed Reviews Only</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useReviewsStore } from '../../../stores/reviews.store';
import { ReviewStatus } from '../models/review.model';
import SearchBar from './SearchBar.vue';

const store = useReviewsStore();

function onSearchChange(val: string) {
  store.setSearch(val);
}

function onStatusChange(e: Event) {
  const val = (e.target as HTMLSelectElement).value;
  store.setStatusFilter(val as ReviewStatus | 'ALL');
}

function onProviderChange(e: Event) {
  const val = (e.target as HTMLSelectElement).value;
  store.setAiProviderFilter(val);
}

function onLanguageChange(e: Event) {
  const val = (e.target as HTMLSelectElement).value;
  store.setLanguageFilter(val);
}

function onSortChange(e: Event) {
  const val = (e.target as HTMLSelectElement).value;
  const [sortBy, sortOrder] = val.split(':') as [any, any];
  store.setSorting(sortBy, sortOrder);
}

function onFailedToggle(e: Event) {
  const checked = (e.target as HTMLInputElement).checked;
  store.setFailedOnly(checked);
}
</script>

<style scoped>
.filter-panel {
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-lg);
  padding: 1rem 1.25rem;
  box-shadow: var(--admin-shadow-sm);
}

.filter-main-row {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 1024px) {
    flex-direction: row;
    align-items: flex-end;
  }
}

.search-wrapper {
  flex: 1;
  min-width: 280px;
}

.controls-group {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.875rem;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.filter-label {
  font-size: 0.6875rem;
  font-weight: 700;
  color: var(--admin-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.filter-select {
  padding: 0.5rem 0.75rem;
  border-radius: var(--admin-radius-md);
  border: 1px solid var(--admin-border-color);
  background-color: var(--admin-bg-app);
  color: var(--admin-text-primary);
  font-size: 0.8125rem;
  font-weight: 500;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: var(--admin-primary);
  }
}

.filter-checkbox-item {
  display: flex;
  align-items: center;
  padding-bottom: 0.5rem;
}

.checkbox-label {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--admin-text-primary);
  cursor: pointer;

  input {
    accent-color: var(--admin-primary);
  }
}
</style>
