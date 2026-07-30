<template>
  <span class="score-badge" :class="scoreClass">
    <span class="score-value">{{ score > 0 ? score : 'N/A' }}</span>
    <span v-if="score > 0" class="score-unit">/100</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  score: number;
}>();

const scoreClass = computed(() => {
  if (!props.score || props.score <= 0) return 'score-none';
  if (props.score >= 90) return 'score-excellent';
  if (props.score >= 75) return 'score-good';
  if (props.score >= 60) return 'score-warning';
  return 'score-poor';
});
</script>

<style scoped>
.score-badge {
  display: inline-flex;
  align-items: baseline;
  gap: 0.125rem;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.8125rem;
  line-height: 1;
}

.score-unit {
  font-size: 0.6875rem;
  opacity: 0.75;
  font-weight: 500;
}

.score-excellent {
  background-color: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.score-good {
  background-color: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.score-warning {
  background-color: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.score-poor {
  background-color: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.score-none {
  background-color: rgba(100, 116, 139, 0.12);
  color: #94a3b8;
  border: 1px solid rgba(100, 116, 139, 0.2);
}
</style>
