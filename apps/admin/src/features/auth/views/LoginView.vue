<template>
  <div class="admin-login-view">
    <div class="login-container">
      <div class="brand-header">
        <div class="logo-box">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        </div>
        <h1 class="brand-title">CodeLens <span class="badge">ADMIN</span></h1>
        <p class="brand-subtitle">Enterprise Code Review Platform Administration</p>
      </div>

      <div class="login-card">
        <h2 class="card-title">Sign In</h2>
        <p class="card-subtitle">Enter your administrator credentials to access the portal.</p>

        <AdminLoginForm />
      </div>

      <div class="login-footer">
        <p>CodeLens AI Platform &copy; 2026. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminLoginForm from '../components/AdminLoginForm.vue';
</script>

<style scoped>
.admin-login-view {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--admin-bg-app) 0%, rgba(15, 23, 42, 0.98) 100%);
  padding: 1.5rem;
}
.login-container {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}
.brand-header {
  text-align: center;
}
.logo-box {
  width: 48px;
  height: 48px;
  background-color: var(--admin-primary);
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  margin-bottom: 0.75rem;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}
.brand-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--admin-text-primary);
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.02em;
}
.badge {
  font-size: 0.6875rem;
  background: rgba(37, 99, 235, 0.2);
  color: var(--admin-primary);
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 700;
}
.brand-subtitle {
  font-size: 0.8125rem;
  color: var(--admin-text-secondary);
  margin: 0;
}
.login-card {
  width: 100%;
  background-color: var(--admin-bg-surface);
  border: 1px solid var(--admin-border-color);
  border-radius: var(--admin-radius-md);
  padding: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--admin-text-primary);
  margin: 0 0 0.25rem 0;
}
.card-subtitle {
  font-size: 0.8125rem;
  color: var(--admin-text-secondary);
  margin: 0 0 1.5rem 0;
}
.login-footer {
  text-align: center;
  font-size: 0.75rem;
  color: var(--admin-text-muted);
}
</style>
