# CodeLens – AI-Powered Code Review Platform

<p align="center">
  <img src="https://img.shields.io/badge/Java-21%20LTS-007396?style=for-the-badge&logo=java&logoColor=white" alt="Java 21 LTS" />
  <img src="https://img.shields.io/badge/Spring%20Boot-3.3.1-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot 3.3" />
  <img src="https://img.shields.io/badge/Google%20Gemini-AI%20Engine-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini API" />
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL 8.0" />
  <img src="https://img.shields.io/badge/Thymeleaf-3.1-005F0F?style=for-the-badge&logo=thymeleaf&logoColor=white" alt="Thymeleaf" />
  <img src="https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap 5" />
  <img src="https://img.shields.io/badge/License-Enterprise-red?style=for-the-badge" alt="Enterprise License" />
</p>

> **CodeLens** is a production-ready, enterprise-grade AI-powered code review platform designed to transform peer-to-peer code reviews into an automated, high-throughput, intelligence-driven workflow. Combining **Spring Boot MVC**, **Google Gemini LLM intelligence**, **MySQL 8.0**, and **Thymeleaf + Bootstrap 5**, CodeLens enforces strict corporate coding standards, detects OWASP security vulnerabilities, profiles cyclomatic complexity, and generates contextual refactoring diffs.

---

## 📌 Table of Contents

- [Executive Overview](#-executive-overview)
- [Key Enterprise Features](#-key-enterprise-features)
- [System Architecture](#-system-architecture)
- [Technology Stack Matrix](#-technology-stack-matrix)
- [Enterprise Documentation Index](#-enterprise-documentation-index)
- [Local Development & Quick Start](#-local-development--quick-start)
- [Security & Compliance Baseline](#-security--compliance-baseline)
- [Development Standards & SOLID Principles](#-development-standards--solid-principles)
- [Future Architecture Roadmap](#-future-architecture-roadmap)
- [License & Governance](#-license--governance)

---

## 🚀 Executive Overview

Modern enterprise software development organizations face severe operational bottlenecks during manual code reviews. Prolonged pull-request (PR) turnaround times, inconsistent quality checks, human fatigue, and missed zero-day vulnerabilities directly degrade engineering velocity and production stability.

**CodeLens** solves this critical operational problem by introducing an intelligent, automated review layer into the development pipeline. Built upon strict Fortune 500 engineering practices, CodeLens shifts security and quality inspection left—providing real-time static code analysis, security auditing, and executable refactoring suggestions before code reaches human reviewers.

```
       +-----------------------------------------------------------------------+
       |                           CODELENS PLATFORM                           |
       +-----------------------------------------------------------------------+
       |                                                                       |
       |  +--------------------+     +-------------------+     +------------+  |
       |  | Software Developer | --> | CodeLens Platform | --> | Google     |  |
       |  | (Submits Code/Diff)|     | (Spring Boot MVC) |     | Gemini AI  |  |
       |  +--------------------+     +-------------------+     +------------+  |
       |                                       |                     |         |
       |                                       v                     v         |
       |                             +-------------------+     +------------+  |
       |                             | MySQL Relational  |     | Refactored |  |
       |                             | Audit & Metrics   |     | Diff Suggest| |
       |                             +-------------------+     +------------+  |
       |                                                                       |
       +-----------------------------------------------------------------------+
```

---

## ✨ Key Enterprise Features

| Feature Module | Core Capabilities | Target Metric / Benchmark |
| :--- | :--- | :--- |
| 🔑 **User Identity & RBAC** | Spring Security 6.x authentication, BCrypt cost 12 hashing, session management, and role-based permissions (`ADMIN`, `LEAD`, `DEV`, `AUDITOR`). | 100% RBAC access control coverage |
| 🤖 **Gemini AI Review Engine** | Asynchronous Google Gemini LLM API integration with structured system prompts, token budget management, and PII scrubbing. | `< 10s` AI scan latency for 500 LOC |
| 🛡️ **OWASP Security Scanner** | Automated inspection for OWASP Top 10 vulnerabilities (SQLi, XSS, Hardcoded API Keys, Insecure Deserialization). | Zero critical security bypasses allowed |
| 📊 **Complexity & Quality Profiler**| Cyclomatic complexity scoring, Java Clean Code & ES6 style violation detection, and duplication profiling. | Highlights methods with CC score > 10 |
| 🔀 **Interactive Diff Viewer** | Dark-mode side-by-side and inline code diff rendering built with Thymeleaf, Bootstrap 5, and ES6 JS. | Zero layout shift during render |
| 📈 **Executive Analytics** | Real-time code quality trends, vulnerability density, team review velocity, and downloadable audit reports. | Instant Spring MVC model rendering |

---

## 🏗️ System Architecture

CodeLens enforces the **Model-View-Controller (MVC)** architectural pattern, structured to support future microservices migration:

```
+---------------------------------------------------------------------------------------------------+
|                                       CODELENS CONTAINER TOPOLOGY                                 |
|                                                                                                   |
|  +---------------------------------------------------------------------------------------------+  |
|  |                             PRESENTATION LAYER (SPRING MVC & THYMELEAF)                     |  |
|  |  Thymeleaf Server Templates  |  Bootstrap 5.3 Custom Theme  |  ES6 Interactive Scripts        |  |
|  +---------------------------------------------------------------------------------------------+  |
|                                                |                                                  |
|                                                v                                                  |
|  +---------------------------------------------------------------------------------------------+  |
|  |                           SPRING BOOT 3.3 APPLICATION CORE SERVICE                          |  |
|  |                                                                                             |  |
|  |  +------------------------+   +------------------------+   +-----------------------------+  |  |
|  |  | Spring MVC Controllers |   | Stateless Service Tier |   | Spring Security 6.x Filter  |  |  |
|  |  +------------------------+   +------------------------+   +-----------------------------+  |  |
|  |              |                            |                                |                |  |
|  |              v                            v                                v                |  |
|  |  +------------------------+   +------------------------+   +-----------------------------+  |  |
|  |  | Spring Data JPA Repos  |   | Gemini AI Gateway Service  Audit & Exception Advice   |  |  |
|  |  +------------------------+   +------------------------+   +-----------------------------+  |  |
|  +---------------------------------------------------------------------------------------------+  |
|                 |                                    |                                            |
+-----------------|------------------------------------|--------------------------------------------+
                  | JDBC / TLS (HikariCP)              | REST / HTTPS (TLS 1.3)
                  v                                    v
   +------------------------------+     +------------------------------+
   |   MySQL 8.0 Enterprise DB    |     |   Google Gemini API Cloud    |
   | (InnoDB Storage, UTF8MB4)    |     |  (AI Code Analysis LLM)      |
   +------------------------------+     +------------------------------+
```

---

## 🛠️ Technology Stack Matrix

| Domain / Layer | Technology Choice | Version | Enterprise Justification |
| :--- | :--- | :--- | :--- |
| **Language Runtime** | Java LTS | `21 / 17` | High concurrency, Project Loom virtual thread support, sealed classes, pattern matching. |
| **Core Framework** | Spring Boot | `3.3.1` | Production-ready framework providing auto-configuration, dependency injection, and metrics. |
| **Security Tier** | Spring Security | `6.x` | Industry gold-standard for enterprise authentication, CSRF protection, and RBAC authorization. |
| **Persistence Tier** | Spring Data JPA / Hibernate | `6.5` | Abstraction layer for transactional operations, reducing boilerplate while maintaining schema control. |
| **Relational Database**| MySQL Enterprise | `8.0` | ACID-compliant storage engine with native `JSON` column support for review metadata. |
| **Web Presentation** | Thymeleaf + Bootstrap | `3.1 / 5.3` | Server-rendered HTML providing low UI latency, anti-XSS protection, and dark-mode ergonomics. |
| **Artificial Intelligence**| Google Gemini API | `1.5-Flash` | Context-aware LLM for structural code analysis, security auditing, and diff generation. |
| **Build System** | Apache Maven | `3.9+` | Deterministic build lifecycle management, explicit versioning, and CI/CD integration. |

---

## 📚 Enterprise Documentation Index

CodeLens includes extensive enterprise documentation detailing every aspect of software engineering governance:

```
CodeLens/
├── docs/
│   ├── 01_PROJECT_VISION.md                    # Strategic Vision & Scope Alignment
│   ├── 01_ENTERPRISE_PROJECT_STRUCTURE.md      # Directory Layout & Component Governance
│   ├── 01_SOFTWARE_REQUIREMENTS_SPECIFICATION.md # SRS Functional & Non-Functional Baseline
│   ├── architecture/
│   │   └── 01_SYSTEM_ARCHITECTURE.md           # System Architecture & C4 Container Blueprint
│   ├── database/
│   │   └── 01_DATABASE_OVERVIEW.md             # MySQL Schema Architecture & Data Governance
│   ├── ui-ux/
│   │   └── 01_UI_UX_VISION.md                  # Developer Ergonomics & Component Specs
│   ├── backend/
│   │   └── 01_BACKEND_FOUNDATION_OVERVIEW.md   # Java 21 & Spring Boot Core Framework Rules
│   ├── security/
│   │   └── 01_IAM_OVERVIEW.md                  # Identity & Access Management & OWASP Defenses
│   └── phase08_user_management/
│       └── 01_USER_MANAGEMENT_ARCHITECTURE.md  # User Profile & Activity Audit Architecture
```

---

## 💻 Local Development & Quick Start

### Prerequisites
- **Java Development Kit (JDK):** Version 17 LTS or 21 LTS installed.
- **Apache Maven:** Version 3.8.x or 3.9.x installed.
- **MySQL Database Server:** Version 8.0 running locally or in Docker.
- **Google Gemini API Key:** Valid API key from Google AI Studio.

### 1. Repository Setup
```bash
git clone https://github.com/mohammadali-eth/CodeLens.git
cd CodeLens
```

### 2. Configure Environment Variables
Copy `.env.example` to create your local environment file or set environment variables:
```bash
export DB_HOST=localhost
export DB_PORT=3306
export DB_NAME=codelens_db
export DB_USER=root
export DB_PASS=your_mysql_password
export GEMINI_API_KEY=your_gemini_api_key
```

### 3. Build & Compile Application
Execute Maven build to compile source code and verify tests:
```bash
mvn clean compile
```

### 4. Run Application locally
Start Spring Boot application server:
```bash
mvn spring-boot:run
```

Access the application in Google Chrome at:  
👉 **`http://localhost:8080`**

---

## 🔒 Security & Compliance Baseline

CodeLens implements a **Zero-Trust** security architecture:

- **Password Hashing:** Passwords salted and hashed using `BCryptPasswordEncoder` (Cost Factor 12).
- **CSRF Defense:** Synchronizer Token Pattern enforced across all Thymeleaf form submissions.
- **Secrets Protection:** Zero persistent exposure of API keys; code snippets undergo PII/secret regex sanitization before LLM dispatch.
- **Security Headers:** Enforces `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `HTTP Strict Transport Security (HSTS)`, and `Content-Security-Policy`.
- **Database Encryption:** Database tables encrypted at rest (AES-256) and in transit (TLS 1.3).

---

## 🏛️ Development Standards & SOLID Principles

CodeLens mandates strict compliance with five enterprise software architecture rules:

1. **Constructor Injection Only:** Field `@Autowired` is strictly forbidden. Dependencies are injected via explicit `final` constructor parameters.
2. **Immutability by Default:** API request/response payloads use Java 21 `record` types.
3. **Disabled OSIV:** Open-Session-In-View disabled (`spring.jpa.open-in-view=false`) to force explicit transaction boundaries.
4. **Decoupled AI Engine:** Gemini API client logic is encapsulated within `IAICodeReviewGateway` to allow offline mocking.
5. **Fail-Fast Validation:** Incoming controller payloads validated via `@Valid` before service execution.

---

## 🗺️ Future Architecture Roadmap

```
+-------------------+      +-------------------+      +-------------------+
| Phase 1: Monolith | ---> | Phase 2: Scale    | ---> | Phase 3: AI Ops   |
| Spring Boot MVC   |      | Redis Caching     |      | Microservices &   |
| MySQL + Gemini    |      | RabbitMQ Queueing |      | Self-Healing PRs  |
+-------------------+      +-------------------+      +-------------------+
```

---

## 📄 License & Governance

Copyright © 2026 CodeLens Enterprise Architecture Team. All Rights Reserved.  
Distributed under the **Enterprise Software License**. See `LICENSE` for full details.
