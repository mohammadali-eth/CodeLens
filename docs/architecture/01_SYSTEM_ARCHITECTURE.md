# Document 01: System Architecture Specification

**Project Name:** CodeLens – AI-Powered Code Review Platform  
**Document ID:** CL-ARCH-SYS-01  
**Version:** 1.0.0-RELEASE  
**Classification:** Enterprise Technical Architecture Standard  
**Authors:** Principal Software Architect, Enterprise Java Architect, Solution Architect, Security Architect, AI Systems Architect, Technical Lead  

---

## 1. Document Metadata, Control & Stakeholders

| Metadata Field | Specification Details |
| :--- | :--- |
| **Document Title** | CodeLens - Enterprise System Architecture Specification |
| **Project Code** | `CODELENS-ENTERPRISE` |
| **Document Owner** | Enterprise Architecture Review Board (EARB) |
| **Target Audience** | Enterprise Architects, Engineering Directors, Technical Leads, DevOps Engineers, Security Officers |
| **Review Cycle** | Quarterly / Major Release Review |
| **Effective Date** | July 2026 |

### 1.1 Stakeholder Matrix

| Stakeholder Role | Representative | Primary Interest / Concerns |
| :--- | :--- | :--- |
| **Chief Technology Officer (CTO)** | Executive Office | Long-term scalability, ROI, microservices evolution path |
| **Principal Software Architect** | Architecture Office | Architectural integrity, SOLID principles, low coupling |
| **Security Architect** | InfoSec Team | OWASP vulnerability protection, API secret security, RBAC |
| **AI Systems Architect** | AI Engineering | Google Gemini API integration resilience, prompt determinism |
| **DevOps Lead** | Infrastructure | CI/CD automation, high availability, containerization |

### 1.2 Revision History

| Version | Date | Author | Description of Change | Review Status |
| :--- | :--- | :--- | :--- | :--- |
| **0.1.0-DRAFT** | 2026-07-16 | Lead Architect | Initial structural design and component decomposition | Draft |
| **0.9.0-RC** | 2026-07-20 | Security & AI Architects | Integrated Gemini API gateway and RBAC security bounds | In Review |
| **1.0.0-RELEASE** | 2026-07-21 | Enterprise Arch Board | Finalized system architecture baseline for execution | **APPROVED** |

---

## 2. Executive Summary & Purpose

### 2.1 Purpose
The purpose of this **System Architecture Specification** is to define the holistic, end-to-end technical blueprint for **CodeLens – AI-Powered Code Review Platform**. It establishes the system context, component topology, architectural drivers, technology stack decisions, security boundaries, and microservices-evolution roadmap.

This document serves as the supreme technical reference for engineering teams, ensuring that all implementation details conform to clean architecture principles, enterprise security standards, and high-performance throughput benchmarks.

### 2.2 Architectural Mission Statement
> *"To architect a unified, secure, high-concurrency code review platform that combines Java 21 virtual threading and Spring Boot MVC architecture with Google Gemini API intelligence—delivering real-time automated code quality analysis, security flaw detection, and contextual refactoring while maintaining modular independence for seamless future microservices migration."*

---

## 3. System Scope, Assumptions & Constraints

### 3.1 Scope Boundaries
- **In-Scope:** Single-repository Spring Boot MVC web application serving server-rendered Thymeleaf views, asynchronous Gemini AI review integration, local file diff engine, OWASP security profiling, and MySQL database persistence.
- **Out-of-Scope (Phase 1):** Self-hosted open-source LLM model training, multi-tenant Kubernetes microservices deployment, custom hardware GPU cluster orchestration.

### 3.2 Key Architecture Assumptions
1. **Gemini API Service Level Agreement:** Google Gemini API maintains >= 99.9% uptime and accepts REST/JSON payloads via HTTPS.
2. **Database Sizing:** Initial MySQL database storage is sized to handle 10,000 code reviews per day with index optimization.
3. **Execution Runtime:** Target hosting environment supports OpenJDK 21 LTS with Virtual Threads enabled.

### 3.3 System Constraints
- **Framework Constraint:** Core application must strictly follow the Model-View-Controller (MVC) pattern using Spring Boot and Thymeleaf.
- **Data Privacy Constraint:** Enterprise source code sent to Google Gemini API must undergo pre-transmission PII/secret scrubbing and must comply with enterprise data protection agreements.
- **Build Constraint:** Project builds must be fully reproducible using standard Apache Maven 3.9+.

---

## 4. System Context & C4 Container Architecture

### 4.1 Level 1: System Context Diagram (C4 Model)

```
                                +---------------------------+
                                |    Software Developer /   |
                                |     Lead Reviewer         |
                                +---------------------------+
                                              |
                                              | HTTPS / Web Browser
                                              v
+-----------------------+        +-----------------------------------+        +-----------------------+
|  GitHub / VCS Repos   | <----> |        CODELENS PLATFORM          | <----> |   Google Gemini API   |
|  (Source Code / Diffs)|        |  (AI-Powered Review System)       |        | (AI Inference Gateway)|
+-----------------------+        +-----------------------------------+        +-----------------------+
                                              |
                                              | JDBC / TLS
                                              v
                                +---------------------------+
                                |    MySQL Database         |
                                | (Users, Metrics, Reviews) |
                                +---------------------------+
```

### 4.2 Level 2: Container Architecture Diagram

```
+---------------------------------------------------------------------------------------------------+
|                                       CODELENS SYSTEM BOUNDARY                                     |
|                                                                                                   |
|  +---------------------------------------------------------------------------------------------+  |
|  |                              WEB PRESENTATION CONTAINER (MVC)                               |  |
|  |  Thymeleaf Rendered Views  |  Bootstrap 5 CSS / HTML5  |  ES6 JavaScript Interactions       |  |
|  +---------------------------------------------------------------------------------------------+  |
|                                                |                                                  |
|                                                v                                                  |
|  +---------------------------------------------------------------------------------------------+  |
|  |                            SPRING BOOT APPLICATION CORE CONTAINER                           |  |
|  |                                                                                             |  |
|  |  +------------------------+   +------------------------+   +-----------------------------+  |  |
|  |  |  Spring MVC Controllers|   |  Domain Services Tier  |   | Security Engine (Spring Sec)|  |  |
|  |  +------------------------+   +------------------------+   +-----------------------------+  |  |
|  |              |                            |                                |                |  |
|  |              v                            v                                v                |  |
|  |  +------------------------+   +------------------------+   +-----------------------------+  |  |
|  |  | Spring Data JPA Repos  |   | AI Integration Gateway |   | Audit & Exception Manager   |  |  |
|  |  +------------------------+   +------------------------+   +-----------------------------+  |  |
|  +---------------------------------------------------------------------------------------------+  |
|                 |                                    |                                            |
+-----------------|------------------------------------|--------------------------------------------+
                  | JDBC / TLS                         | REST / HTTPS (TLS 1.3)
                  v                                    v
   +------------------------------+     +------------------------------+
   |   MySQL Relational Database  |     |   Google Gemini API Cloud    |
   | (Data Store & Audit Logging) |     |  (Code Analysis LLM Service) |
   +------------------------------+     +------------------------------+
```

---

## 5. Enterprise Architectural Principles & Drivers

CodeLens strictly adheres to six core software engineering principles to guarantee high quality and smooth microservices migration:

```
               +------------------------------------------------+
               |        CORE ARCHITECTURAL PRINCIPLES           |
               +------------------------------------------------+
                                       |
    +--------------+---------+---------+---------+--------------+
    |              |         |         |         |              |
    v              v         v         v         v              v
+-------+      +-------+ +-------+ +-------+ +-------+      +-------+
| SOLID |      | Clean | | SoC   | | Zero  | | Decou |      | Micro |
| Desgn |      | Arch  | | Layer | | Trust | | AI API|      | Ready |
+-------+      +-------+ +-------+ +-------+ +-------+      +-------+
```

1. **SOLID Design Principles:** Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion are applied across all Java packages.
2. **Clean Architecture / Layered Separation:** High-level domain logic has zero compile-time dependencies on low-level infrastructure frameworks.
3. **Separation of Concerns (SoC):** Controllers only manage HTTP protocols; Services handle business transactions; Repositories manage database I/O; AI Gateways encapsulate LLM communication.
4. **Zero-Trust Security Baseline:** All user inputs are sanitized; passwords hashed with BCrypt; API calls authorized via RBAC permissions.
5. **Decoupled AI Engine:** Google Gemini integration is abstracted behind an interface (`AICodeReviewGateway`), enabling swap-outs or local mock testing without touching core domain code.
6. **Microservices Preparedness:** Modules (`auth`, `repository`, `review`, `ai`, `analytics`) communicate via explicit, decoupled service interfaces, making future split into independent microservices seamless.

---

## 6. Core Technology Stack & Strategic Justifications

| Stack Layer | Technology | Architectural Justification & Enterprise Fit |
| :--- | :--- | :--- |
| **Language Runtime** | **Java 21 LTS** | Virtual Threads (Project Loom) provide lightweight concurrent thread management for outbound AI API requests without thread pool starvation. |
| **Application Framework** | **Spring Boot 3.x** | Enterprise gold-standard for Java applications; provides auto-configuration, dependency injection, and production readiness. |
| **Web Presentation** | **Spring MVC + Thymeleaf** | Server-side rendering reduces frontend complexity, simplifies security model, and accelerates initial time-to-market. |
| **UI Styling & Assets** | **Bootstrap 5 + ES6 JS** | Lightweight, responsive design framework for dark-mode code diff viewers and dashboard visualization. |
| **Persistence Engine** | **Spring Data JPA / Hibernate** | Eliminates boilerplate SQL, enforces type-safe criteria queries, and provides transactional integrity. |
| **Relational Database** | **MySQL 8.0 Enterprise** | Proven ACID-compliant database with JSON column support for flexible review metric storage. |
| **Artificial Intelligence**| **Google Gemini API** | Advanced LLM providing contextual code analysis, multi-language support, security vulnerability scanning, and diff generation. |
| **Build & Dependency** | **Apache Maven 3.9+** | Declarative lifecycle management, strict dependency governance, and CI/CD integration. |

---

## 7. Subsystems & Module Interfaces

The system is decomposed into five autonomous sub-modules:

```
+-----------------------------------------------------------------------------------+
|                            CODELENS MODULE MAP                                    |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  +-------------------------+            +--------------------------------------+  |
|  | 1. Authentication &     |            | 2. Repository & Workspace            |  |
|  |    RBAC Module          |            |    Management Module                 |  |
|  +-------------------------+            +--------------------------------------+  |
|               |                                            |                      |
|               +----------------------+---------------------+                      |
|                                      |                                            |
|                                      v                                            |
|                         +--------------------------+                              |
|                         | 3. AI Code Review Engine |                              |
|                         |    & Static Profiler     |                              |
|                         +--------------------------+                              |
|                                      |                                            |
|               +----------------------+---------------------+                      |
|               |                                            |                      |
|               v                                            v                      |
|  +-------------------------+            +--------------------------------------+  |
|  | 4. Review History &     |            | 5. Analytics & Executive             |  |
|  |    Audit Trail Module   |            |    Reporting Module                  |  |
|  +-------------------------+            +--------------------------------------+  |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### Module Interface Contracts

1. **`IAuthenticationService`:** Handles credential authentication, session tokens, and user profile management.
2. **`IRepositoryManagementService`:** Manages workspace repository configurations, file tree parsing, and diff extraction.
3. **`IAICodeReviewGateway`:** Encapsulates Gemini API communication, prompt payload formatting, and response parsing.
4. **`IReviewAuditService`:** Records immutable review histories, execution latencies, and security findings.
5. **`IAnalyticsReportingService`:** Aggregates code quality metrics, team review velocity, and defect breakdown charts.

---

## 8. Architecture Decision Records (ADRs)

### ADR-001: Adoption of Java 21 LTS & Virtual Threads
- **Status:** **ACCEPTED**
- **Context:** Outbound Gemini API calls introduce network latency (2s - 10s). Traditional platform thread-per-request models risk thread exhaustion under high concurrent developer usage.
- **Decision:** Standardize on Java 21 LTS using Virtual Threads (`Executors.newVirtualThreadPerTaskExecutor()`).
- **Consequences:** Near-infinite concurrency throughput for I/O-bound AI requests with low memory overhead.

### ADR-002: Monolithic Spring Boot MVC Architecture with Microservices Readiness
- **Status:** **ACCEPTED**
- **Context:** The system needs fast initial deployment while preserving future microservices evolution.
- **Decision:** Build a single Spring Boot MVC monolith using strictly encapsulated package modules (`com.codelens.module.*`).
- **Consequences:** Simplifies deployment and debugging initially; allows splitting into microservices (e.g., Auth Service, AI Gateway) without major refactoring.

### ADR-003: Integration Gateway Strategy for Google Gemini API
- **Status:** **ACCEPTED**
- **Context:** Direct LLM calls inside controllers risk coupling, security leaks, and lack of resilience.
- **Decision:** Implement a dedicated `GeminiAIServiceGateway` featuring Spring `RestClient`, exponential backoff retry, and regex sanitization.
- **Consequences:** Ensures zero PII/secret exposure to Gemini API, supports offline mocking, and provides fault tolerance.

---

## 9. Cross-Cutting Architectural Concerns

### 9.1 Security Architecture
- **TLS 1.3 Encryption:** All network traffic in transit is encrypted using TLS 1.3.
- **Credential Storage:** MySQL user passwords stored via BCrypt (strength 12).
- **Secrets Management:** Gemini API keys injected dynamically via environment variables (`${GEMINI_API_KEY}`).

### 9.2 Observability & Monitoring
- **Structured JSON Logging:** Logback configured with JSON formatting for centralized log indexing (Elasticsearch / Splunk).
- **Metrics Collection:** Spring Boot Actuator exposes Prometheus metrics (`http_requests_total`, `ai_latency_seconds`).

### 9.3 Resilience & Disaster Recovery
- **Circuit Breaker Pattern:** Resilience4j wraps outbound Gemini API calls to prevent system degradation during AI service outages.
- **Database Backup:** Daily automated MySQL database snapshots with point-in-time recovery (PITR).

---

## 10. Architectural Risks & Mitigation Matrix

| Risk ID | Architecture Risk Event | Severity | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **AR-01** | Gemini API Rate Limits Exceeded | **HIGH** | Implement local response caching for identical code hashes + asynchronous job queueing. |
| **AR-02** | High Database I/O on Review Logs | **MEDIUM** | Partition MySQL `review_history` tables by month; create indexes on `repository_id` and `created_at`. |
| **AR-03** | Monolithic Package Tight Coupling | **MEDIUM** | Enforce ArchUnit automated tests in CI pipeline to block illegal cross-package package calls. |

---

## 11. Architecture Review & Approval Matrix

Before proceeding to sub-architectural designs, the designated architecture review board must approve this baseline:

- [x] C4 System Context and Container diagrams documented.
- [x] Java 21, Spring Boot MVC, MySQL, and Gemini API choices justified with ADRs.
- [x] SOLID and Clean Architecture principles integrated into module design.
- [x] Microservices readiness guidelines established.
- [x] Security, observability, and disaster recovery baselines defined.

| Architecture Role | Name / Title | Decision Status | Date |
| :--- | :--- | :--- | :--- |
| **Principal Software Architect** | Head of Software Architecture | **APPROVED** | July 21, 2026 |
| **Enterprise Java Architect** | Java Steering Committee Lead | **APPROVED** | July 21, 2026 |
| **Security Architect** | Chief Information Security Officer | **APPROVED** | July 21, 2026 |
| **AI Systems Architect** | Enterprise AI Integration Lead | **APPROVED** | July 21, 2026 |
| **Database Architect** | Principal Data Architect | **APPROVED** | July 21, 2026 |

---

## 12. Related Architecture Documents

- Document 02: High-Level Design (HLD) (`docs/architecture/02_HIGH_LEVEL_DESIGN.md`)
- Document 04: MVC Architecture (`docs/architecture/04_MVC_ARCHITECTURE.md`)
- Document 15: AI System Architecture (`docs/architecture/15_AI_SYSTEM_ARCHITECTURE.md`)
- Document 18: Security Architecture (`docs/architecture/18_SECURITY_ARCHITECTURE.md`)
