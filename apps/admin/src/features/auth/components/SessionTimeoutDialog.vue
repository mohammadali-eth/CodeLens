<template>
  <ConfirmationDialog
    :is-open="isWarningActive"
    title="Session Expiring Soon"
    :message="`Your administrative session will expire in ${countdown} seconds due to inactivity. Would you like to extend your session?`"
    confirm-text="Extend Session"
    cancel-text="Sign Out Now"
    variant="warning"
    @confirm="handleExtend"
    @cancel="handleLogout"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue';
import { useAuthStore } from '../../../stores/auth.store';
import { sessionManager } from '../../../core/auth/session-manager';
import ConfirmationDialog from '../../../shared/components/ConfirmationDialog.vue';

const authStore = useAuthStore();
const countdown = ref(60);
let timer: ReturnType<typeof setInterval> | null = null;

const isWarningActive = computed(() => authStore.sessionStatus === 'WARNING');

watch(isWarningActive, (active) => {
  if (active) {
    countdown.value = 60;
    timer = setInterval(() => {
      if (countdown.value > 1) {
        countdown.value--;
      } else {
        clearInterval(timer!);
        handleLogout();
      }
    }, 1000);
  } else if (timer) {
    clearInterval(timer);
    timer = null;
  }
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

function handleExtend() {
  sessionManager.extendSession();
}

function handleLogout() {
  authStore.logout();
}
</script>
