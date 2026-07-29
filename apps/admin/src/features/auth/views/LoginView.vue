<template>
  <div class="login-view">
    <div class="login-card">
      <h2 class="title">CodeLens Admin Portal</h2>
      <p class="subtitle">Sign in with administrative credentials</p>
      <div class="placeholder-box">
        <p>Authentication Interface Baseline</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--admin-bg-app);
}
.login-card {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: var(--admin-bg-surface);
  border-radius: var(--admin-radius-md);
  border: 1px solid var(--admin-border-color);
  box-shadow: var(--admin-shadow-sm);
  text-align: center;
}
.title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--admin-text-primary);
  margin-bottom: 0.25rem;
}
.subtitle {
  font-size: 0.875rem;
  color: var(--admin-text-secondary);
  margin-bottom: 1.5rem;
}
.placeholder-box {
  padding: 1rem;
  background: rgba(37, 99, 235, 0.05);
  border: 1px dashed var(--admin-primary);
  border-radius: 6px;
  color: var(--admin-primary);
  font-size: 0.875rem;
}
</style>
