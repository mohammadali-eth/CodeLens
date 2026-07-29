<template>
  <div class="unauthorized-view">
    <div class="card-box">
      <div class="icon-box">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
        </svg>
      </div>
      <h1 class="title">403 – Access Forbidden</h1>
      <p class="description">
        You do not have the required administrative permissions to access this page or resource. Please contact your system administrator if you believe this is an error.
      </p>
      <div class="actions">
        <button class="btn btn-primary" @click="goDashboard">Return to Dashboard</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goDashboard() {
  router.push('/dashboard');
}
</script>

<style scoped>
.unauthorized-view {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
.card-box {
  max-width: 480px;
  width: 100%;
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  padding: 2.5rem 2rem;
  text-align: center;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}
.icon-box {
  color: #ef4444;
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
