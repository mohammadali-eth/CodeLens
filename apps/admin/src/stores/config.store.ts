import { defineStore } from 'pinia';
import { ref } from 'vue';
import { appConfig, FeatureFlags } from '../config';

export const useConfigStore = defineStore('config', () => {
  const flags = ref<FeatureFlags>({ ...appConfig.featureFlags });

  function setFeatureFlag(flag: keyof FeatureFlags, enabled: boolean): void {
    flags.value[flag] = enabled;
  }

  return {
    flags,
    setFeatureFlag,
  };
});
