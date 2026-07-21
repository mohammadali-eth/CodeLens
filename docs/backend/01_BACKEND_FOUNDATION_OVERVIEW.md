# Document 01: Backend Foundation Overview & Core Architecture

**Project Name:** CodeLens – AI-Powered Code Review Platform  
**Document ID:** CL-BE-01  
**Version:** 1.0.0-RELEASE  
**Classification:** Enterprise Backend Engineering Standard  
**Authors:** Principal Java Architect, Spring Boot Architect, Enterprise Backend Engineer, Technical Lead, Engineering Manager  

---

## 1. Document Control & Metadata

| Metadata Field | Specification Details |
| :--- | :--- |
| **Document Title** | CodeLens - Enterprise Backend Foundation Overview & Architecture |
| **Project Code** | `CODELENS-ENTERPRISE-BE` |
| **Document Owner** | Enterprise Java Architecture Council (EJAC) |
| **Target Audience** | Backend Engineers, Java Architects, Technical Leads, QA Automation Engineers, DevOps Engineers |
| **Review Cycle** | Sprint 0 Foundation / Major Version Review |
| **Effective Date** | July 2026 |

### 1.1 Stakeholder & Governance Matrix

| Stakeholder Role | Representative | Primary Technical Interest |
| :--- | :--- | :--- |
| **Principal Java Architect** | Architecture Office | Java 21 idiomatic patterns, Virtual Threads, sealed classes, performance |
| **Spring Boot Architect** | Core Engineering | Application context startup speed, Spring Data JPA configuration, Bean lifecycle |
| **Technical Lead** | Delivery Team | Package structure, clean code practices, developer onboarding simplicity |
| **Engineering Manager** | Software Delivery | Production readiness, zero technical debt baseline, team velocity |

### 1.2 Revision History

| Version | Date | Author | Description of Change | Review Status |
| :--- | :--- | :--- | :--- | :--- |
| **0.1.0-DRAFT** | 2026-07-17 | Backend Lead | Initial draft of core backend foundational framework architecture | In Review |
| **0.9.0-RC** | 2026-07-20 | Spring Architect | Integrated Java 21 Virtual Thread executor & JPA Auditing rules | Pending |
| **1.0.0-RELEASE** | 2026-07-21 | Architecture Council | Approved baseline backend foundation specification | **APPROVED** |

---

## 2. Executive Summary & Purpose

### 2.1 Purpose
The purpose of this **Backend Foundation Overview** is to define the non-negotiable architectural foundation, reusable core frameworks, layer isolation rules, and enterprise Java standards for **CodeLens – AI-Powered Code Review Platform**.

Before implementing any application business features (such as user authentication, repository scanning, or Gemini AI code analysis), a robust, production-ready backend framework must be established. This document governs all cross-cutting infrastructure components including base persistence entities, global exception handling, standardized API responses, DTO mappings, logging, and environment configuration strategies.

### 2.2 Architectural Mission Statement
> *"To construct an immutable, highly maintainable, and observable Spring Boot backend foundation on Java 21 that enforces strict layer decoupling, zero boilerplate repetition, and seamless extensibility for enterprise code analysis workloads."*

---

## 3. Scope & Foundational Architecture Topology

```
+-----------------------------------------------------------------------------------+
|                        CODELENS BACKEND FOUNDATION LAYERING                       |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | 1. PRESENTATION & API ADAPTER TIER (SPRING MVC)                             |  |
|  | - Controllers (`@Controller`, `@RestController`)                             |  |
|  | - View Resolution (Thymeleaf Model Binding)                                 |  |
|  | - Global Exception Advice (`@RestControllerAdvice`)                         |  |
|  +-----------------------------------------------------------------------------+  |
|                                         |                                         |
|                                         v                                         |
|  +-----------------------------------------------------------------------------+  |
|  | 2. CORE BUSINESS SERVICE TIER                                               |  |
|  | - Stateless Services (`@Service`, `@Transactional`)                         |  |
|  | - DTO / Entity Mappers (MapStruct / Record DTOs)                            |  |
|  | - Asynchronous Task Execution (Java 21 Virtual Threads)                      |  |
|  +-----------------------------------------------------------------------------+  |
|                                         |                                         |
|                                         v                                         |
|  +-----------------------------------------------------------------------------+  |
|  | 3. PERSISTENCE & INFRASTRUCTURE TIER (SPRING DATA JPA)                     |  |
|  | - Base Abstract Entities (`@MappedSuperclass`, `@EntityListeners`)           |  |
|  | - Spring Data JPA Repositories (`JpaRepository`, `JpaSpecificationExecutor`) |  |
|  | - Database Connection Pool (HikariCP / MySQL 8.0)                           |  |
|  +-----------------------------------------------------------------------------+  |
|                                         |                                         |
|                                         v                                         |
|  +-----------------------------------------------------------------------------+  |
|  | 4. CROSS-CUTTING CORE FOUNDATION MODULES                                    |  |
|  | - Unified API Response Envelope (`ApiResponse<T>`)                          |  |
|  | - Sealed Exception Hierarchy (`BaseBusinessException`)                       |  |
|  | - Structured JSON Logging Framework (Logback / SLF4J)                        |  |
|  | - Multi-Profile Configuration (`application-{profile}.yml`)                  |  |
|  +-----------------------------------------------------------------------------+  |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---

## 4. Reusable Framework Foundations & Subsystems

The CodeLens backend foundation consists of nine standardized, non-business framework modules:

| Foundation Module | Technical Mechanism | Operational Responsibility |
| :--- | :--- | :--- |
| **Base Entity Framework** | `@MappedSuperclass` `BaseEntity` | Provides standard surrogate primary keys (`id`), optimistic locks (`version`), and soft-delete flags (`isDeleted`). |
| **Auditing Framework** | Spring Data JPA `@EnableJpaAuditing` | Automatically captures `createdAt`, `createdBy`, `updatedAt`, and `updatedBy` fields for every entity transaction. |
| **DTO & Mapper Framework** | Java 21 `record` + MapStruct | Guarantees immutability for API requests/responses; decouples JPA Entities from Presentation models. |
| **Exception Framework** | `@RestControllerAdvice` + Sealed Exceptions | Translates all system exceptions into standardized, secure HTTP JSON error payloads without stack trace leakage. |
| **Unified Response Envelope**| Generic `ApiResponse<T>` wrapper | Standardizes API payload structures across all endpoints (`timestamp`, `status`, `message`, `data`, `errors`). |
| **Validation Framework** | Jakarta Bean Validation (`@NotNull`, `@Size`) | Intercepts malformed inputs before service layer execution; maps validation errors to response envelope. |
| **Logging Framework** | SLF4J + Logback Structured JSON | Enforces correlation IDs (`MDC`) for distributed tracing and context-aware request logging. |
| **Database Connection** | HikariCP + Spring Data JPA | Manages connection pooling, transaction isolation (`READ_COMMITTED`), and health check validation. |
| **Configuration Profile** | Spring `@ConfigurationProperties` | Type-safe environment variable binding for `dev`, `test`, and `prod` profiles. |

---

## 5. Enterprise Engineering & SOLID Principles

CodeLens mandates compliance with five enterprise software architecture standards:

1. **Constructor Dependency Injection:** Field injection (`@Autowired` on private fields) is **STRICTLY FORBIDDEN**. All dependencies must be injected via explicit `final` constructor parameters.
2. **Immutability by Default:** Request/Response payloads, value objects, and DTOs must use Java 21 `record` types.
3. **Single Responsibility Principle (SRP):** Controllers handle HTTP protocol mapping; Services execute business logic; Repositories handle data persistence.
4. **Interface Segregation & Abstraction:** Third-party integrations (e.g., Gemini API) are isolated behind Java interfaces to allow painless unit testing and implementation replacement.
5. **Fail-Fast Input Validation:** Invalid inputs are rejected at the Web/Controller boundary via `@Valid` before consuming backend compute resources.

---

## 6. Technology Stack Best Practices & Guidelines

### 6.1 Java 21 LTS Guidelines
- **Virtual Threads:** Configure Spring Boot 3.x to use Virtual Thread Executors (`spring.threads.virtual.enabled=true`) for non-blocking I/O operations.
- **Pattern Matching for Switch:** Utilize Java 21 pattern matching within exception handling advice to route custom domain errors cleanly.

### 6.2 Spring Boot & Spring Data JPA Guidelines
- **Explicit Transaction Management:** Services executing read-only database queries must be annotated with `@Transactional(readOnly = true)` to optimize Hibernate dirty-checking overhead.
- **No Open-Session-In-View (OSIV):** Disable OSIV (`spring.jpa.open-in-view=false`) to force explicit database transaction boundaries and prevent lazy initialization query N+1 pitfalls.

---

## 7. Common Implementation Pitfalls & Anti-Patterns

| Anti-Pattern | Description | Foundational Corrective Action |
| :--- | :--- | :--- |
| **Field `@Autowired`** | Injecting dependencies directly on class fields. | Use constructor injection with `final` fields. |
| **Leaking JPA Entities** | Returning `@Entity` objects directly in Controller responses. | Map Entities to immutable DTO Records using MapStruct. |
| **Swallowing Exceptions** | Catching exceptions without logging or rethrowing (`catch (Exception e) {}`). | Allow custom exceptions to bubble up to `@RestControllerAdvice`. |
| **Inconsistent API Payloads**| Returning raw strings, maps, or naked objects from API endpoints. | Wrap all controller responses in generic `ApiResponse<T>`. |
| **Hardcoded Config Values** | Hardcoding timeouts, DB credentials, or URLs in Java code. | Externalize all configuration into `application.yml` bound to `@ConfigurationProperties`. |

---

## 8. Backend Strategic Risk & Mitigation Register

| Risk ID | Identified Foundation Risk | Severity | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **RSK-BE-01** | Database Connection Pool Exhaustion | **HIGH** | Set HikariCP `maximum-pool-size=20`, `minimum-idle=10`, `connection-timeout=30000ms`. |
| **RSK-BE-02** | Hibernate N+1 Select Query Spikes | **HIGH** | Enforce `spring.jpa.open-in-view=false` and require `@EntityGraph` or JOIN FETCH for relational queries. |
| **RSK-BE-03** | Unhandled Stack Trace Leakage to Clients | **HIGH** | Centralize global exception advice; sanitize stack traces in non-dev environments. |

---

## 9. Foundation Readiness Validation Checklist

Before declaring the backend foundation complete and commencing feature development, verify compliance against this validation checklist:

- [x] Java 21 Virtual Thread configuration standards established.
- [x] Base Entity, JPA Auditing, and Soft-Delete strategy defined.
- [x] Immutable DTO (Java Record) and MapStruct guidelines documented.
- [x] Global Exception Advice and generic `ApiResponse<T>` envelope specified.
- [x] OSIV disabled (`open-in-view=false`) and constructor injection enforced.
- [x] All 20 backend foundation document scopes outlined.

| Architecture Role | Name / Title | Decision Status | Date |
| :--- | :--- | :--- | :--- |
| **Principal Java Architect** | Head of Enterprise Java Architecture | **APPROVED** | July 21, 2026 |
| **Spring Boot Architect** | Principal Framework Architect | **APPROVED** | July 21, 2026 |
| **Technical Lead** | Backend Engineering Lead | **APPROVED** | July 21, 2026 |
| **Engineering Manager** | Software Delivery Director | **APPROVED** | July 21, 2026 |

---

## 10. Related Backend Foundation Specifications

- Document 02: Project Bootstrap Guide (`docs/backend/02_PROJECT_BOOTSTRAP_GUIDE.md`)
- Document 07: Base Entity Design (`docs/backend/07_BASE_ENTITY_DESIGN.md`)
- Document 11: Global Exception Framework (`docs/backend/11_GLOBAL_EXCEPTION_FRAMEWORK.md`)
- Document 12: API Response Framework (`docs/backend/12_API_RESPONSE_FRAMEWORK.md`)
