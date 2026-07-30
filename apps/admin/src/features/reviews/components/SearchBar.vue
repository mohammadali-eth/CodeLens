<template>
  <div class="search-bar">
    <span class="search-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    </span>
    <input
      :value="localValue"
      type="text"
      class="search-input"
      :placeholder="placeholder || 'Search code reviews...'"
      @input="onInput"
    />
    <button
      v-if="localValue"
      type="button"
      class="clear-btn"
      aria-label="Clear search"
      @click="clear"
    >
      ✕
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue?: string;
  placeholder?: string;
  debounceMs?: number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const localValue = ref(props.modelValue || '');
let timeoutId: ReturnType<typeof setTimeout> | null = null;

watch(
  () => props.modelValue,
  (val) => {
    localValue.value = val || '';
  }
);

function onInput(e: Event) {
  const val = (e.target as HTMLInputElement).value;
  localValue.value = val;

  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    emit('update:modelValue', val);
  }, props.debounceMs ?? 300);
}

function clear() {
  localValue.value = '';
  if (timeoutId) clearTimeout(timeoutId);
  emit('update:modelValue', '');
}
</script>

<style scoped>
.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  color: var(--admin-text-muted);
  display: flex;
  align-items: center;
  pointer-events: none;

  svg {
    width: 1rem;
    height: 1rem;
  }
}

.search-input {
  width: 100%;
  padding: 0.5rem 2.25rem 0.5rem 2.25rem;
  border-radius: var(--admin-radius-md);
  border: 1px solid var(--admin-border-color);
  background-color: var(--admin-bg-app);
  color: var(--admin-text-primary);
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s;

  &::placeholder {
    color: var(--admin-text-muted);
  }

  &:focus {
    border-color: var(--admin-primary);
  }
}

.clear-btn {
  position: absolute;
  right: 0.75rem;
  border: none;
  background: transparent;
  color: var(--admin-text-muted);
  font-size: 0.75rem;
  cursor: pointer;

  &:hover {
    color: var(--admin-text-primary);
  }
}
</style>
