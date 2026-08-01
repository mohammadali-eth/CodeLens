<script setup lang="ts">
import { ref } from 'vue';
import { ApiKeyItem, CreateApiKeyDto } from '../models/system-admin.model';

defineProps<{
  apiKeys: ApiKeyItem[];
  isSaving?: boolean;
}>();

const emit = defineEmits<{
  (e: 'create', dto: CreateApiKeyDto): void;
  (e: 'revoke', id: string): void;
}>();

const showCreateModal = ref(false);
const newlyCreatedSecret = ref<string | null>(null);

const newKeyForm = ref<CreateApiKeyDto>({
  name: '',
  ownerEmail: 'admin@codelens.ai',
  scopes: ['reviews.read', 'analytics.read'],
  expiresInDays: 90,
});

const handleCreateSubmit = () => {
  emit('create', { ...newKeyForm.value });
  showCreateModal.value = false;
  newlyCreatedSecret.value = `cl_live_${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`;
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  alert('API Key secret copied to clipboard!');
};
</script>

<template>
  <div class="panel-card">
    <div class="panel-header">
      <div class="header-left">
        <h3 class="panel-title">System API Key Management</h3>
        <p class="panel-subtitle">Generate high-privilege programmatic access keys, assign RBAC scopes, and manage revocation.</p>
      </div>

      <button class="create-btn" @click="showCreateModal = true">
        + Create API Key
      </button>
    </div>

    <!-- Secret Display Banner -->
    <div v-if="newlyCreatedSecret" class="secret-banner">
      <div class="banner-text">
        <strong>⚠️ Save your API Secret Key now!</strong>
        <span class="subtext">This secret key will never be shown again.</span>
      </div>
      <div class="secret-copy-box">
        <code>{{ newlyCreatedSecret }}</code>
        <button class="copy-btn" @click="copyToClipboard(newlyCreatedSecret)">Copy</button>
        <button class="close-banner" @click="newlyCreatedSecret = null">✕</button>
      </div>
    </div>

    <div class="table-responsive">
      <table class="key-table">
        <thead>
          <tr>
            <th>Key Name</th>
            <th>Prefix</th>
            <th>Owner</th>
            <th>Scopes</th>
            <th>Created</th>
            <th>Expires</th>
            <th>State</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="key in apiKeys" :key="key.id" :class="{ 'is-revoked': key.isRevoked }">
            <td class="name-cell">
              <span class="key-name">{{ key.name }}</span>
            </td>
            <td><code>{{ key.keyPrefix }}••••</code></td>
            <td class="owner-cell">{{ key.ownerEmail }}</td>
            <td>
              <div class="scopes-list">
                <span v-for="scope in key.scopes" :key="scope" class="scope-pill">{{ scope }}</span>
              </div>
            </td>
            <td>{{ new Date(key.createdAt).toLocaleDateString() }}</td>
            <td>{{ key.expiresAt ? new Date(key.expiresAt).toLocaleDateString() : 'Never' }}</td>
            <td>
              <span class="status-tag" :class="{ revoked: key.isRevoked }">
                {{ key.isRevoked ? 'REVOKED' : 'ACTIVE' }}
              </span>
            </td>
            <td>
              <button
                v-if="!key.isRevoked"
                class="revoke-btn"
                @click="emit('revoke', key.id)"
              >
                Revoke
              </button>
              <span v-else class="revoked-text">Inactive</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal for Creating API Key -->
    <div v-if="showCreateModal" class="modal-overlay">
      <div class="modal-card">
        <h4 class="modal-title">Generate New API Key</h4>
        <form @submit.prevent="handleCreateSubmit">
          <div class="form-group">
            <label class="form-label">Key Name</label>
            <input v-model="newKeyForm.name" type="text" class="form-input" placeholder="e.g. CI/CD Deploy Service" required />
          </div>

          <div class="form-group">
            <label class="form-label">Owner Administrative Email</label>
            <input v-model="newKeyForm.ownerEmail" type="email" class="form-input" required />
          </div>

          <div class="form-group">
            <label class="form-label">Expiration Period</label>
            <select v-model.number="newKeyForm.expiresInDays" class="form-select">
              <option :value="30">30 Days</option>
              <option :value="90">90 Days</option>
              <option :value="365">1 Year</option>
              <option :value="undefined">Never Expire</option>
            </select>
          </div>

          <div class="modal-actions">
            <button type="button" class="cancel-btn" @click="showCreateModal = false">Cancel</button>
            <button type="submit" class="submit-btn">Generate Key</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.panel-card {
  background: var(--admin-bg-surface, #ffffff);
  border: 1px solid var(--admin-border-color, #e2e8f0);
  border-radius: var(--admin-radius-md, 10px);
  padding: 1.5rem;
  box-shadow: var(--admin-shadow-sm);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
}

.panel-title { font-size: 1.2rem; font-weight: 700; color: var(--admin-text-primary, #0f172a); margin: 0; }
.panel-subtitle { font-size: 0.85rem; color: var(--admin-text-muted, #64748b); margin-top: 0.2rem; }

.create-btn {
  background: var(--admin-primary, #2563eb);
  color: #ffffff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--admin-radius-sm, 6px);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: var(--admin-primary-hover, #1d4ed8); }
}

.secret-banner {
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;

  .banner-text { display: flex; flex-direction: column; color: var(--admin-warning, #f59e0b); font-size: 0.85rem; }
  .subtext { font-size: 0.75rem; opacity: 0.85; }

  .secret-copy-box { display: flex; align-items: center; gap: 0.5rem; }
  code { font-family: monospace; font-size: 0.85rem; background: var(--admin-bg-surface, #ffffff); padding: 0.3rem 0.6rem; border-radius: 4px; border: 1px solid var(--admin-border-color, #e2e8f0); }
  .copy-btn { background: var(--admin-primary, #2563eb); color: #fff; border: none; padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer; }
  .close-banner { background: transparent; border: none; font-weight: 700; cursor: pointer; color: var(--admin-text-muted, #64748b); }
}

.table-responsive { overflow-x: auto; }

.key-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.85rem;

  th, td { padding: 0.85rem 1rem; border-bottom: 1px solid var(--admin-border-color, #e2e8f0); }
  th { font-size: 0.75rem; text-transform: uppercase; color: var(--admin-text-muted, #64748b); font-weight: 600; }
  tr.is-revoked { opacity: 0.55; }
}

.key-name { font-weight: 700; color: var(--admin-text-primary, #0f172a); }

.scopes-list { display: flex; gap: 0.3rem; flex-wrap: wrap; }
.scope-pill { font-size: 0.7rem; background: var(--admin-bg-app, #f1f5f9); color: var(--admin-text-secondary, #334155); padding: 0.1rem 0.4rem; border-radius: 4px; }

.status-tag {
  font-size: 0.72rem; font-weight: 800; padding: 0.15rem 0.45rem; border-radius: 4px;
  color: var(--admin-success, #10b981); background: rgba(16, 185, 129, 0.12);
  &.revoked { color: var(--admin-danger, #ef4444); background: rgba(239, 68, 68, 0.12); }
}

.revoke-btn {
  background: transparent; border: 1px solid rgba(239, 68, 68, 0.4); color: var(--admin-danger, #ef4444);
  font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.55rem; border-radius: 4px; cursor: pointer;
  &:hover { background: rgba(239, 68, 68, 0.1); }
}

.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;
}

.modal-card {
  background: var(--admin-bg-surface, #ffffff); border: 1px solid var(--admin-border-color, #e2e8f0);
  border-radius: 12px; padding: 1.5rem; width: 420px; max-width: 90vw; display: flex; flex-direction: column; gap: 1rem;
}

.modal-title { font-size: 1.1rem; font-weight: 700; color: var(--admin-text-primary, #0f172a); margin: 0; }
.form-group { display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.85rem; }
.form-label { font-size: 0.8rem; font-weight: 600; color: var(--admin-text-secondary, #334155); }
.form-input, .form-select { padding: 0.5rem 0.75rem; border-radius: 6px; border: 1px solid var(--admin-border-color, #e2e8f0); font-size: 0.85rem; }

.modal-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.5rem; }
.cancel-btn { background: transparent; border: 1px solid var(--admin-border-color, #e2e8f0); padding: 0.45rem 0.85rem; border-radius: 6px; cursor: pointer; }
.submit-btn { background: var(--admin-primary, #2563eb); color: #fff; border: none; padding: 0.45rem 0.85rem; border-radius: 6px; font-weight: 600; cursor: pointer; }
</style>
