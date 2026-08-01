# System Administration & Platform Configuration Architecture (Phase A7)

## 1. Executive Summary & Overview
Phase A7 implements the production-ready **System Administration & Platform Configuration** module within the CodeLens Admin Monorepo. This module equips platform administrators with granular control over global settings, security policies, multi-provider AI engine integrations, dynamic feature flags, API key lifecycle management, real-time audit trails, storage limits, mail server diagnostics, and scheduled maintenance modes.

---

## 2. Layered Clean Architecture

```mermaid
graph TD
    A[SystemSettingsPage Layout] --> B[SettingsSidebar Navigation]
    A --> C[SettingsSection Dynamic Renderer]
    
    subgraph Presentation Components
        C --> D1[GeneralSettingsPanel]
        C --> D2[SecuritySettingsPanel]
        C --> D3[AIProviderTable]
        C --> D4[FeatureFlagTable]
        C --> D5[IntegrationCard Grid]
        C --> D6[ApiKeyTable]
        C --> D7[AuditLogTable]
        C --> D8[MaintenancePanel]
        C --> D9[StoragePanel]
        C --> D10[EmailPanel]
        C --> D11[AboutPanel]
    end

    subgraph State & Orchestration
        useSystemAdminRealtime --> PiniaStore[useSystemAdminStore]
        Presentation Components --> PiniaStore
    end

    subgraph Service & Network Layer
        PiniaStore --> AdminSystemService[AdminSystemService REST Client]
        useSystemAdminRealtime --> WebSocketService[WebSocketService Gateway]
    end

    subgraph Backend Microservices
        AdminSystemService -->|HTTP REST| NestJSBackend[/admin/settings, /admin/feature-flags, etc.]
        WebSocketService -->|WSS Events| NestJSGateway[WebSocket Telemetry Gateway]
    end
```

---

## 3. Core Modules & Responsibilities

1. **General Settings**: Configures Platform Name, Organization Name, Timezone, Primary Language, and Brand Assets.
2. **Security Settings**: Governs Password Policies (length, special characters), Session Timeouts, Max Login Rate Limits, and JWT metadata.
3. **AI Provider Management**: Multi-provider registry (Gemini, OpenAI, Anthropic, DeepSeek), model selection, status health, latency tracking, and connection testing.
4. **Feature Flags**: Dynamic feature toggling, environment filtering, searchability, and zero-downtime feature rollouts.
5. **Integrations**: Third-party integrations (GitHub, GitLab, Bitbucket, Slack, Email, Webhooks), status monitoring, and connection validation.
6. **API Key Management**: Cryptographic API key generation, owner attribution, scope assignment, rotation, and instant revocation.
7. **Audit Logs**: Immutable administration action audit trails with administrative user, action type, IP address, and payload inspection.
8. **Maintenance Mode**: One-click platform lockdown, scheduled maintenance windows, customizable user notification banners, and IP bypass rules.
9. **Storage Telemetry**: Local vs S3 storage bucket utilization, total capacity, remaining space, and file size upload limits.
10. **Email Diagnostics**: SMTP connectivity health, mail queue throughput, masked credential validation, and test email sending.
11. **About Platform**: Operational version metadata, license status, build hash, and system release information.

---

## 4. Real-Time Telemetry & WebSocket Channels

The module subscribes to live system channels via `useSystemAdminRealtime`:
* `system:flag_updated`: Broadcasts real-time feature flag state changes across all admin sessions.
* `system:provider_status`: Broadcasts AI provider availability and latency ticks.
* `system:maintenance_changed`: Notifies active sessions when platform maintenance is toggled.
* `system:audit_event`: Appends new administrative audit events in real-time.
* `system:config_updated`: Rehydrates global settings when updated by co-administrators.

---

## 5. Security & RBAC Guarding
* All modification endpoints enforce strict `UserRole.SUPER_ADMIN` and `UserRole.ADMIN` roles guarded by NestJS `JwtAuthGuard` and `RolesGuard`.
* Sensitive settings (e.g. SMTP passwords, API key secrets) are masked by default with one-time copy-to-clipboard security.
