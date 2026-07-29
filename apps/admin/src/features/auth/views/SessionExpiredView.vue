<template>
  <div class="session-expired-view">
    <div class="card-box">
      <div class="icon-box">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      </div>
      <h1 class="title">Session Expired</h1>
      <p class="description">
        Your administrator security session has timed out due to inactivity or token expiration. Please sign in again to resume your work.
      </p>
      <div class="actions">
        <button class="btn btn-primary" @click="goLogin">Sign In Again</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goLogin() {
  router.push({ name: 'login' });
}
</script>

<style scoped>
.session-expired-view {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--admin-bg-app);
  padding: 1.5rem;
}
.card-box {
  max-width: 440px;
  width: 100%;
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  padding: 2.5rem 2rem;
  text-align: center;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}
.icon-box {
  color: #f59e0b;
  margin-bottom: 1rem;
}
.title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--admin-text-primary);
  margin: 0 0 0.5rem 0;
}
.description {
  font-size: 0.875rem;
  color: var(--admin-text-secondary);
  line-height: 1.5;
  margin: 0 0 1.5rem 0;
}
.actions {
  display: flex;
  justify-content: center;
}
.btn-primary {
  padding: 0.625rem 1.25rem;
  background-color: var(--admin-primary);
  color: #ffffff;
  border: none;
  border-radius: var(--admin-radius-md);
  font-weight: 600;
  cursor: pointer;
}
</style>
