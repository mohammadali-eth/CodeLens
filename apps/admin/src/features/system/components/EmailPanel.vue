<script setup lang="ts">
import { ref } from 'vue';
import { EmailTelemetry } from '../models/system-admin.model';

defineProps<{
  email: EmailTelemetry | null;
}>();

const emit = defineEmits<{
  (e: 'sendTestEmail', recipient: string): void;
}>();

const testRecipient = ref('');
const isSending = ref(false);
const feedback = ref<string | null>(null);

const handleSendTest = () => {
  if (!testRecipient.value) return;
  isSending.value = true;
  emit('sendTestEmail', testRecipient.value);
  setTimeout(() => {
    feedback.value = `Test email successfully dispatched to ${testRecipient.value}`;
    isSending.value = false;
  }, 600);
};
</script>

<template>
  <div class="panel-card">
    <div class="panel-header">
      <h3 class="panel-title">Mail Gateway & SMTP Diagnostic Settings</h3>
      <p class="panel-subtitle">Monitor SMTP connection health, email queue throughput, and send diagnostic test emails.</p>
    </div>

    <div v-if="!email" class="empty-state">
      <p>Email server telemetry unavailable.</p>
    </div>

    <div v-else class="email-content">
      <div class="email-metrics-grid">
        <div class="metric-box">
          <span class="label">SMTP Host & Port</span>
          <span class="value">{{ email.smtpHost }}:{{ email.smtpPort }}</span>
        </div>

        <div class="metric-box">
          <span class="label">SMTP Status</span>
          <span class="status-tag" :class="email.smtpStatus.toLowerCase()">
            ● {{ email.smtpStatus }}
          </span>
        </div>

        <div class="metric-box">
          <span class="label">Sender Account</span>
          <span class="value">{{ email.smtpUserMasked }}</span>
        </div>

        <div class="metric-box">
          <span class="label">Total Processed</span>
          <span class="value">{{ email.queueProcessedCount.toLocaleString() }} Emails</span>
        </div>
      </div>

      <div class="test-email-box">
        <h4 class="box-title">Send Diagnostic Test Email</h4>
        <form @submit.prevent="handleSendTest" class="test-form">
          <input
            v-model="testRecipient"
            type="email"
            placeholder="enter-recipient@domain.com"
            class="form-input"
            required
          />
          <button type="submit" class="send-btn" :disabled="isSending">
            <span v-if="isSending">Sending...</span>
            <span v-else>Send Test Mail</span>
          </button>
        </form>
        <span v-if="feedback" class="feedback-text">{{ feedback }}</span>
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

.panel-header { margin-bottom: 1.5rem; }
.panel-title { font-size: 1.2rem; font-weight: 700; color: var(--admin-text-primary, #0f172a); margin: 0; }
.panel-subtitle { font-size: 0.85rem; color: var(--admin-text-muted, #64748b); margin-top: 0.2rem; }

.email-content { display: flex; flex-direction: column; gap: 1.5rem; }
.email-metrics-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }

.metric-box {
  background: var(--admin-bg-surface-hover, #f8fafc);
  border: 1px solid var(--admin-border-color, #e2e8f0);
  border-radius: var(--admin-radius-sm, 8px);
  padding: 1rem;
  display: flex; flex-direction: column; gap: 0.3rem;
  .label { font-size: 0.78rem; font-weight: 600; color: var(--admin-text-muted, #64748b); text-transform: uppercase; }
  .value { font-size: 1.1rem; font-weight: 700; color: var(--admin-text-primary, #0f172a); }
}

.status-tag {
  font-size: 0.85rem; font-weight: 800;
  &.connected { color: var(--admin-success, #10b981); }
  &.disconnected { color: var(--admin-danger, #ef4444); }
}

.test-email-box {
  background: var(--admin-bg-surface-hover, #f8fafc);
  border: 1px solid var(--admin-border-color, #e2e8f0);
  border-radius: var(--admin-radius-sm, 8px);
  padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem;

  .box-title { font-size: 0.95rem; font-weight: 700; color: var(--admin-text-primary, #0f172a); margin: 0; }
}

.test-form { display: flex; gap: 0.75rem; max-width: 500px; }
.form-input {
  flex: 1; padding: 0.55rem 0.85rem; border-radius: var(--admin-radius-sm, 6px);
  border: 1px solid var(--admin-border-color, #e2e8f0); font-size: 0.88rem;
}

.send-btn {
  background: var(--admin-primary, #2563eb); color: #fff; border: none;
  padding: 0.55rem 1.1rem; border-radius: var(--admin-radius-sm, 6px); font-weight: 600; font-size: 0.85rem; cursor: pointer;
}

.feedback-text { font-size: 0.8rem; color: var(--admin-success, #10b981); font-weight: 600; }
.empty-state { padding: 2rem; text-align: center; color: var(--admin-text-muted, #64748b); }
</style>
