import { defineStore } from 'pinia';
import { ref } from 'vue';
import { themeService, ThemeMode } from '../core/services/theme.service';

export const useThemeStore = defineStore('theme', () => {
  const currentMode = ref<ThemeMode>(themeService.getTheme());

  function setTheme(mode: ThemeMode): void {
    currentMode.value = mode;
    themeService.setTheme(mode);
  }

  function toggleTheme(): void {
    const nextMode: ThemeMode = currentMode.value === 'dark' ? 'light' : 'dark';
    setTheme(nextMode);
  }

  return {
    currentMode,
    setTheme,
    toggleTheme,
  };
});
