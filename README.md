# 🔍 CodeLens — Enterprise AI-Powered Code Review Platform

[![NestJS](https://img.shields.io/badge/Backend-NestJS_v11-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Angular](https://img.shields.io/badge/User_Portal-Angular_v17-DD0031?logo=angular&logoColor=white)](https://angular.io/)
[![Vue](https://img.shields.io/badge/Admin_Portal-Vue_v3-4FC08D?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Cache-Redis_7-DC382D?logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Infrastructure-Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-Proprietary-000000.svg)](LICENSE)

> **CodeLens** is a multi-tenant, enterprise-grade AI-powered code inspection and review platform. Built with **Clean Architecture** and **Domain-Driven Design (DDD)** principles, CodeLens automates code health evaluations, security vulnerability scanning, and real-time developer feedback using multi-model AI strategies (Google Gemini, OpenAI GPT, and local Ollama models).

---

## 🌟 Architecture Highlights

- **Clean Architecture & DDD**: Strict separation of concerns across Domain, Application, and Infrastructure layers. Core business logic remains 100% framework-agnostic.
- **Multi-AI Gateway (Strategy Pattern)**: Dynamically switch between **Google Gemini**, **OpenAI**, and self-hosted **Ollama** LLMs at runtime.
- **Enterprise Secret & PII Sanitizer**: Built-in regex scrubber that strips AWS keys, API tokens, JWTs, and database credentials before sending snippets to cloud AI providers.
- **Hierarchical RBAC Security**: Role-based permission enforcement (`ADMIN > LEAD > DEV`) with bcrypt credential hashing (cost factor 12) and JWT token validation.
- **Shared Monorepo Type Safety**: Distributed DTOs and domain types shared seamlessly across NestJS, Angular, and Vue.js via `@codelens/shared-dto`.
- **Infrastructure & Observability**: Integrated Docker Compose stack with PostgreSQL 16, Redis 7, Prometheus metric scrapers, and Grafana monitoring dashboards.

---

## 🏛️ System Architecture

```mermaid
graph TD
    ClientUser["Angular User Portal (apps/frontend)"] -->|REST / WS| Gateway["NestJS API Gateway (apps/backend)"]
    ClientAdmin["Vue.js Admin Portal (apps/admin)"] -->|REST| Gateway

    subgraph "NestJS Backend (Clean Architecture)"
        Gateway --> Auth["Auth Module (IAM & RBAC)"]
        Gateway --> Review["Code Review Engine"]
        Gateway --> AIModule["Multi-AI Gateway"]
        Gateway --> ChatModule["AI Chat Gateway"]

        Review --> Repos["Prisma DB Adapters"]
        AIModule --> AISanitizer["PII & Secret Sanitizer"]
        AISanitizer --> Gemini["Google Gemini API"]
        AISanitizer --> OpenAI["OpenAI GPT API"]
        AISanitizer --> Ollama["Local Ollama LLM"]
    end

    Repos --> Postgres[(PostgreSQL 16)]
    Gateway --> Redis[(Redis 7 Cache)]
    Gateway --> Prometheus[Prometheus & Grafana]
```

---

## 💻 Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | NestJS, TypeScript, Prisma ORM | Microservice-ready REST and WebSocket API Gateway |
| **User Portal** | Angular 17, RxJS, Tailwind CSS | Developer inspection workspace, diff viewers, and AI chat |
| **Admin Portal** | Vue 3, Vite, TypeScript | System administration, metrics monitoring, and audit logs |
| **Database** | PostgreSQL 16 | Relational data persistence for users, reviews, and logs |
| **Caching** | Redis 7 | High-performance session storage and rate limiting |
| **AI Infrastructure** | Gemini API, OpenAI API, Ollama | Multi-provider AI inspection strategy engine |
| **Monitoring** | Prometheus, Grafana | Health check scrapers and real-time metric dashboards |
| **Containerization** | Docker, Docker Compose | Container orchestration for local infrastructure |

---

## 📁 Monorepo Workspace Structure

```
CodeLens/
├── apps/
│   ├── backend/             # NestJS API Server (Clean Architecture + DDD)
│   ├── frontend/            # Angular Developer User Portal
│   └── admin/               # Vue.js Admin Console
├── packages/
│   └── shared-dto/          # Shared TypeScript models and API contracts
├── infrastructure/
│   └── monitoring/          # Prometheus & Grafana configuration files
├── docker-compose.yml       # Local infrastructure stack (Postgres, Redis, Prometheus, Grafana)
├── package.json             # Root monorepo workspace configuration
└── LICENSE                  # Proprietary Enterprise Software License
```

---

## 🚀 Quickstart Guide

### Prerequisites
- **Node.js**: `v18.19.1` or higher
- **npm**: `v9.x` or higher
- **Docker & Docker Compose**: Installed and running

---

### 1. Installation & Environment Setup

Clone the repository and install all monorepo dependencies:

```bash
git clone https://github.com/mohammadali-eth/CodeLens.git
cd CodeLens
npm install
```

Create an `.env` file inside `apps/backend/.env`:

```env
PORT=4000
NODE_ENV=development
DATABASE_URL="postgresql://codelens_user:codelens_pass@localhost:5432/codelens_db?schema=public"
REDIS_HOST="localhost"
REDIS_PORT=6379
JWT_SECRET="super-secret-key-for-codelens-platform-enterprise-version"
DEFAULT_AI_PROVIDER="gemini"
GEMINI_API_KEY="your-gemini-api-key"
OPENAI_API_KEY="your-openai-api-key"
```

---

### 2. Start Local Infrastructure

Boot up PostgreSQL, Redis, Prometheus, and Grafana using Docker Compose:

```bash
npm run docker:up
```

---

### 3. Database Migration & Code Generation

Generate the Prisma Client and sync the relational database schema:

```bash
npx prisma generate --schema=apps/backend/prisma/schema.prisma
npx prisma db push --schema=apps/backend/prisma/schema.prisma
```

---

### 4. Run Application Services

Build all shared packages and start development servers:

```bash
# Build shared DTO package and backend
npm run build:all

# Start backend server (Runs on http://localhost:4000)
npm run backend:dev

# Start Angular User Portal (Runs on http://localhost:4200)
npm run frontend:dev

# Start Vue.js Admin Portal (Runs on http://localhost:5173)
npm run admin:dev
```

---

## 🔌 API Endpoints Summary

### Authentication (`/auth`)
- `POST /auth/register` — Register a new developer account.
- `POST /auth/login` — Authenticate and receive a JWT access token.

### Code Reviews (`/reviews`)
- `POST /reviews` — Submit repository code files for inspection.
- `GET /reviews` — List paginated historical reviews.
- `GET /reviews/:id` — Retrieve review details with flagged security issues.

### AI Inspection Engine (`/ai`)
- `POST /ai/analyze/:reviewId?provider=gemini` — Execute AI code inspection using the specified strategy (`gemini`, `openai`, `ollama`).

### AI Chat Assistant (`/chat`)
- `POST /chat/sessions` — Start a new AI chat session.
- `GET /chat/sessions` — List user chat history.
- `POST /chat/sessions/:id/messages` — Send sanitized code prompts to the AI assistant.

---

## 🛡️ License

Copyright © 2026 CodeLens Platform. All rights reserved.  
Distributed under a **Proprietary Enterprise Software License**. See [LICENSE](LICENSE) for details.
