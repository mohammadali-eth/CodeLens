# Phase A6 – Platform Analytics & Monitoring Architecture

## 1. Overview & System Goals
The **Platform Analytics & Monitoring** module (`apps/admin/src/features/monitoring`) provides system administrators with real-time operational telemetry, infrastructure health stats, BullMQ queue metrics, AI model token consumption analytics, user growth trends, and error log inspection for the CodeLens SaaS platform.

It is designed following **Clean Architecture**, **SOLID Principles**, and **Vue 3 Composition API** best practices, utilizing **Apache ECharts** for high-performance visual canvas rendering and **WebSocket gateway subscriptions** for live streaming updates.

---

## 2. Architectural Layers

```
                               ┌───────────────────────────────────────────┐
                               │       Admin Portal Router & Views         │
                               │  (AnalyticsView.vue, SystemView.vue)      │
                               └─────────────────────┬─────────────────────┘
                                                     │
                               ┌─────────────────────▼─────────────────────┐
                               │   Feature Layer (features/monitoring)     │
                               │  - MonitoringDashboard.vue                │
                               │  - SystemHealthPanel.vue                  │
                               │  - QueueMonitorPanel.vue                  │
                               │  - InfrastructurePanel.vue                │
                               │  - AIAnalyticsPanel.vue                   │
                               │  - AlertCenter.vue / LogPreviewPanel      │
                               └─────────────────────┬─────────────────────┘
                                                     │
                               ┌─────────────────────▼─────────────────────┐
                               │           State Layer (Pinia)             │
                               │   useMonitoringStore / useAnalyticsStore  │
                               └─────────────────────┬─────────────────────┘
                                                     │
                               ┌─────────────────────▼─────────────────────┐
                               │      Service / Transport Layer            │
                               │  - AdminMonitoringService (Axios REST)    │
                               │  - useMonitoringRealtime (WebSocket)      │
                               └─────────────────────┬─────────────────────┘
                                                     │
                               ┌─────────────────────▼─────────────────────┐
                               │             Backend APIs                  │
                               │  - NestJS MonitoringController            │
                               │  - WebSocket Gateway (Namespace: /ws)     │
                               └───────────────────────────────────────────┘
```

---

## 3. Data Models & Interface Specs

### Health Status
- `SystemHealthStatus`: `'HEALTHY' | 'WARNING' | 'CRITICAL' | 'OFFLINE'`
- `ComponentHealth`:
  - `name`: Component name (Backend API, PostgreSQL, Redis, BullMQ, WebSocket Gateway, AI Providers, Storage)
  - `status`: `SystemHealthStatus`
  - `latencyMs`: Response time in ms
  - `message`: Diagnostic message
  - `lastChecked`: ISO timestamp

### Infrastructure Metrics
- `SystemMetrics`:
  - `cpuUsage`: Percentage (0–100)
  - `memoryUsage`: Used vs Total (MB/GB) and Percentage
  - `diskUsage`: Used vs Total (GB) and Percentage
  - `networkTraffic`: Rx/Tx rates (KB/s or MB/s)
  - `activeConnections`: Open HTTP/WS connections

### Queue Metrics (BullMQ)
- `QueueMetrics`:
  - `pendingJobs`: Number of waiting jobs
  - `activeJobs`: Currently executing workers
  - `completedJobs`: Successfully processed jobs
  - `failedJobs`: Errored jobs requiring inspection
  - `delayedJobs`: Scheduled/backoff jobs
  - `retryJobs`: Automatic retries
  - `deadLetterCount`: Dead letter queue size

### AI Token & Cost Analytics
- `AIAnalyticsData`:
  - `providerUsage`: Distribution by Provider (`GEMINI`, `OPENAI`, `ANTHROPIC`, `DEEPSEEK`)
  - `modelUsage`: Breakdown by model (`gemini-1.5-pro`, `gpt-4o`, `claude-3-5-sonnet`)
  - `promptTokens`: Total prompt tokens used
  - `completionTokens`: Total completion tokens generated
  - `estimatedCost`: Calculated USD cost based on token pricing tiers
  - `avgResponseTimeMs`: Average latency across AI calls
  - `failureRate`: Error percentage

---

## 4. Backend REST API & WebSocket Specifications

### REST Endpoints
- `GET /admin/monitoring/health` -> Returns `SystemHealthSummary`
- `GET /admin/monitoring/metrics` -> Returns `SystemMetricsHistory`
- `GET /admin/monitoring/queues` -> Returns `QueueMetricsSummary`
- `GET /admin/monitoring/system` -> Returns CPU/Memory/Disk hardware metrics
- `GET /admin/analytics/ai` -> Returns AI token & provider breakdown
- `GET /admin/analytics/users` -> Returns DAU/MAU user growth statistics
- `GET /admin/analytics/reviews` -> Returns code review throughput & quality trends

### WebSocket Subscriptions
Subscribes to events on gateway namespace:
- `monitoring:health_updated`: Real-time health badge status changes
- `monitoring:metrics_tick`: 5-second metrics heartbeat tick
- `queue:jobs_updated`: Real-time BullMQ job count changes
- `ai:usage_updated`: Live token consumption updates
- `monitoring:alert_triggered`: Critical system error alerts

---

## 5. Key Design & Performance Principles
1. **Zero Fake Placeholders**: All components derive state from Pinia, backed by NestJS REST and WebSocket gateways with resilient fallback defaults.
2. **Apache ECharts Dynamic Canvas**: Charts update cleanly using shallow refs to avoid Vue reactive proxy overhead on large time-series datasets.
3. **Responsive Glassmorphic UI**: Uses standard `--admin-*` SCSS design system tokens (`var(--admin-bg-surface)`, `var(--admin-border-color)`, `var(--admin-text-primary)`).
4. **Accessible & Screen-Reader Ready**: High-contrast health badges, ARIA status tags, and key navigation support.
