# Document 01: Enterprise Project Structure

**Project Name:** CodeLens – AI-Powered Code Review Platform  
**Document ID:** CL-ARCH-01  
**Version:** 1.0.0-RELEASE  
**Classification:** Enterprise Internal Architecture Standard  
**Authors:** Principal Software Architect, Enterprise Java Architect, DevOps Architect  

---

## 1. Purpose & Executive Summary

### 1.1 Purpose
This document defines the standardized enterprise project layout and structural blueprint for **CodeLens – AI-Powered Code Review Platform**. It establishes a clean, decoupled, and maintainable project directory layout conforming to Spring Boot MVC standards, Maven lifecycle requirements, enterprise security protocols, and Google Gemini API integration patterns.

### 1.2 Executive Summary
Enterprise systems require deterministic structural organization to prevent architectural decay, tight coupling, and maintenance friction. CodeLens utilizes a single-repo Maven Spring Boot layout optimized for high scalability, separation of concerns (SoC), seamless developer onboarding, and smooth evolution toward microservices or modular monoliths.

---

## 2. Standard Enterprise Project Structure

Below is the canonical enterprise directory structure for the CodeLens platform:

```
CodeLens/
├── .github/                         # GitHub repository configuration & workflows
│   ├── ISSUE_TEMPLATE/              # Standardized bug and feature templates
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   ├── PULL_REQUEST_TEMPLATE.md     # Enterprise Pull Request template
│   └── workflows/                   # GitHub Actions CI/CD pipelines
│       ├── ci-build.yml             # Maven build, test execution, SonarQube scan
│       └── release-deploy.yml       # Production deployment pipeline
├── docs/                            # Enterprise Architecture & Operations Docs
│   ├── 01_ENTERPRISE_PROJECT_STRUCTURE.md
│   ├── 02_PACKAGE_STRUCTURE.md
│   └── architecture-diagrams/       # High-level architecture & sequence diagrams
├── postman/                         # API testing collections and environments
│   ├── CodeLens_API_Collection.json
│   └── CodeLens_Local_Env.json
├── src/                             # Main application source root
│   ├── main/                        # Production codebase
│   │   ├── java/                    # Java source files (Java 21)
│   │   │   └── com/
│   │   │       └── codelens/
│   │   │           ├── CodeLensApplication.java # Spring Boot Entry Point
│   │   │           ├── annotation/  # Custom enterprise Java annotations
│   │   │           ├── config/      # Spring Boot Security, MVC & Bean configs
│   │   │           ├── controller/  # Spring MVC Controllers (Thymeleaf/API)
│   │   │           ├── dto/         # Data Transfer Objects (Request/Response)
│   │   │           ├── exception/   # Global Exception Handlers & Custom Errors
│   │   │           ├── mapper/      # Entity <-> DTO Mappers
│   │   │           ├── model/       # JPA Entities & Enums (MySQL)
│   │   │           ├── repository/  # Spring Data JPA Repositories
│   │   │           ├── service/     # Business Interfaces & Implementations
│   │   │           │   └── ai/      # Google Gemini API AI Integration Engine
│   │   │           └── util/        # Shared helper utilities & constants
│   │   └── resources/               # Application resources & configuration
│   │       ├── application.yml      # Base Spring Boot configuration
│   │       ├── application-dev.yml  # Development profile configuration
│   │       ├── application-prod.yml # Production profile configuration
│   │       ├── application-test.yml # Testing profile configuration
│   │       ├── banner.txt           # Enterprise startup banner
│   │       ├── db/                  # Database migration scripts (Flyway/Liquibase)
│   │       │   └── migration/
│   │       │       └── V1__initial_schema.sql
│   │       ├── static/              # Web static assets
│   │       │   ├── css/             # Custom Bootstrap 5 extension stylesheets
│   │       │   │   └── custom-theme.css
│   │       │   ├── js/              # Client-side ES6 JavaScript modules
│   │       │   │   ├── app.js
│   │       │   │   └── review-engine.js
│   │       │   └── images/          # Application branding assets & SVGs
│   │       └── templates/           # Thymeleaf Server-Side Templates
│   │           ├── components/      # Reusable Thymeleaf fragments (nav, footer)
│   │           ├── dashboard/       # Analytics & Review metrics UI
│   │           ├── error/           # Standard HTTP error pages (404, 500)
│   │           ├── auth/            # Login, Register, OAuth2 UI
│   │           └── review/          # Code review UI & diff viewers
│   └── test/                        # Automated Test Suites
│       ├── java/                    # JUnit 5 & Mockito test cases
│       │   └── com/
│       │       └── codelens/
│       │           ├── unit/        # Unit tests (Service, Controller)
│       │           ├── integration/ # Spring Boot Test slices & Data JPA tests
│       │           └── ai/          # Gemini API Integration tests & mocks
│       └── resources/               # Test configuration & mock fixtures
│           └── application-test.yml
├── .env.example                     # Environment variables template (Secrets masked)
├── .gitignore                       # Git ignore policies
├── .gitattributes                   # Git line ending standardization
├── LICENSE                          # Enterprise Software License
├── pom.xml                          # Maven Master POM configuration
└── README.md                        # Developer onboarding & build guide
```

---

## 3. Directory Mapping & Enterprise Rationale

| Directory Path | Enterprise Purpose | Rationale & Architectural Governance |
| :--- | :--- | :--- |
| `src/main/java` | Contains all executable Java 21 domain logic. | Enforces strict package encapsulation and layered separation (Controller -> Service -> Repository). |
| `src/main/resources/templates` | Server-Side HTML rendering using Thymeleaf. | Ensures secure HTML generation with anti-XSS protection, reducing client-side execution vulnerabilities. |
| `src/main/resources/static` | Static web assets (CSS3, ES6 JS, Icons). | Separates presentation styling and interactive assets from core application logic for CDN cacheability. |
| `src/main/resources/db/migration` | Versioned database DDL/DML migrations. | Ensures repeatable, automated database schema changes across environments via migration tools. |
| `src/service/ai/` | Gemini AI Client Integration Service layer. | Isolates third-party AI LLM API interactions from core business services to allow resilient failover and mock testing. |
| `postman/` | Automated postman collections & env files. | Provides executable API documentation and smoke test suites for QA and API regression validation. |
| `.github/workflows` | CI/CD automation pipelines. | Enforces zero-friction automated builds, unit tests, static code analysis, and artifact validation on every PR. |

---

## 4. Architectural Layering & Component Responsibilities

CodeLens strictly enforces the **Model-View-Controller (MVC)** architectural pattern enhanced with an explicit AI Integration Domain:

```
       +-------------------------------------------------------------+
       |                     USER BROWSER / CHROME                   |
       +-------------------------------------------------------------+
                                      |
                                      v
       +-------------------------------------------------------------+
       |               PRESENTATION LAYER (SPRING MVC)               |
       |  Thymeleaf Templates + Bootstrap 5 + ES6 JavaScript Assets  |
       +-------------------------------------------------------------+
                                      |
                                      v
       +-------------------------------------------------------------+
       |                 CONTROLLER LAYER (SPRING MVC)               |
       | Handles HTTP Requests, Performs Validation, Returns Views  |
       +-------------------------------------------------------------+
                                      |
                         +------------+------------+
                         |                         |
                         v                         v
       +-----------------------------------+  +-----------------------------------+
       |       BUSINESS SERVICE LAYER      |  |        AI SERVICE LAYER           |
       | Business Logic, Audit Logging,    |  | Gemini API Gateway, Prompt Engine,|
       | Transaction Control (@Transactional)| | Token Manager & Parsing Pipeline  |
       +-----------------------------------+  +-----------------------------------+
                         |                                 |
                         +------------+------------+-------+
                                      |
                                      v
       +-------------------------------------------------------------+
       |            PERSISTENCE LAYER (SPRING DATA JPA)              |
       | Entities, Repositories, Hibernate, MySQL Relational Database|
       +-------------------------------------------------------------+
```

---

## 5. Technology Stack Best Practices & Recommendations

### 5.1 Java 21 LTS Guidelines
- **Virtual Threads (Project Loom):** Leverage Java 21 Virtual Threads (`Executors.newVirtualThreadPerTaskExecutor()`) for handling concurrent Google Gemini API HTTP requests without thread starvation.
- **Record Classes:** Use Java 21 `record` features for immutable Data Transfer Objects (DTOs) and API request/response wrappers.
- **Pattern Matching & Sealed Interfaces:** Utilize pattern matching for `switch` and sealed domain interfaces to enforce type-safe error handling across AI review responses.

### 5.2 Spring Boot & Spring MVC Guidelines
- **Explicit Profile Separation:** Never store environment-specific configs in `application.yml`. Maintain explicit profiles (`dev`, `test`, `prod`) driven by environment variables.
- **Constructor Injection:** Strictly enforce constructor injection over `@Autowired` field injection for immutability and testability.
- **Global Controller Advice:** Centralize all exception processing using `@RestControllerAdvice` and `@ControllerAdvice`.

### 5.3 Thymeleaf & Bootstrap 5 Guidelines
- **Fragment Reusability:** Split layout headers, navigation bars, footers, and code diff blocks into reusable `th:fragment` files inside `templates/components/`.
- **XSS Prevention:** Always use `th:text` instead of raw `th:utext` when rendering AI generated code suggestions to prevent stored Cross-Site Scripting (XSS).

### 5.4 Google Gemini API Integration Guidelines
- **Isolated AI Gateway Package:** Place all Gemini API client logic within `com.codelens.service.ai`.
- **Resilience & Timeouts:** Implement strict connect (5s) and read timeouts (30s) alongside retries using Spring HTTP Client / WebClient.
- **Structured Payload Parsing:** Force Gemini API responses into strict JSON schema representations before binding them to Java DTOs.

---

## 6. Scalability, Maintainability & Security Blueprint

### 6.1 Scalability Considerations
- **Stateless Web Tier:** Spring Boot controllers must retain zero HTTP session state, allowing seamless horizontal scaling behind a Load Balancer (e.g., NGINX / AWS ALB).
- **Asynchronous AI Execution:** Long-running code reviews should leverage `@Async` Spring tasks to prevent HTTP connection exhaustion.

### 6.2 Maintainability Considerations
- **Single Responsibility Principle (SRP):** Controllers only map HTTP models; Services contain business logic; Repositories handle database I/O.
- **Zero Raw Sql Queries:** Prefer Spring Data JPA derived query methods and HQL/JPQL over native SQL queries for DB portability.

### 6.3 Security Baseline
- **Secrets Isolation:** Never commit API keys, MySQL passwords, or JWT secrets to Git. Use environment variable substitution (`${GEMINI_API_KEY}`).
- **Input Sanitization:** Validate all incoming repository URLs, branch names, and uploaded code snippets before passing to Gemini API.

---

## 7. Anti-Patterns & Common Mistakes to Avoid

| Anti-Pattern | Description | Enterprise Corrective Action |
| :--- | :--- | :--- |
| **Fat Controllers** | Placing business logic or JPA calls directly inside Spring MVC controllers. | Move all logic to `@Service` classes; controllers must only orchestrate responses. |
| **Leaking Entities to UI** | Passing JPA Entities (`@Entity`) directly into Thymeleaf views or API responses. | Map Entities to immutable DTOs using MapStruct or custom DTO mappers. |
| **Direct LLM Coupling** | Mixing Gemini API HTTP calls within standard domain services. | Encapsulate Gemini calls inside an `AIServiceGateway` interface. |
| **Hardcoded File Paths** | Using absolute OS file paths (e.g., `C:/code/`) for review artifacts. | Use Spring `ResourceLoader` and relative paths configured via `application.yml`. |

---

## 8. Architectural Governance & Approval Checklist

Before declaring Document 01 baseline approved, verify compliance against the following checklist:

- [x] Standard enterprise directory layout conforms to Maven / Spring Boot conventions.
- [x] All required layers (Controller, Service, Repository, DTO, Model, AI Gateway) are explicitly isolated.
- [x] Static assets (CSS/JS) and server-side templates (Thymeleaf) are cleanly separated.
- [x] Java 21, Spring Boot MVC, MySQL, and Gemini API best practices are defined.
- [x] Security credentials and secrets are excluded from project structure.

---

## 9. Sign-Off & Approval Matrix

| Architectural Role | Reviewer Title | Decision Status | Date |
| :--- | :--- | :--- | :--- |
| **Principal Software Architect** | Head of Enterprise Architecture | **APPROVED** | July 21, 2026 |
| **Enterprise Java Architect** | Lead Java Tech Council | **APPROVED** | July 21, 2026 |
| **DevOps Architect** | CI/CD Infrastructure Lead | **APPROVED** | July 21, 2026 |
| **Engineering Manager** | CodeLens Delivery Lead | **APPROVED** | July 21, 2026 |
