# Phase 8 — Document 01: User Management Architecture Specification

**Project Name:** CodeLens – AI-Powered Code Review Platform  
**Document ID:** CL-PH8-UM-01  
**Version:** 1.0.0-RELEASE  
**Classification:** Enterprise Internal Technical Standard  
**Authors:** Enterprise Program Manager, Principal Software Architect, CTO, Principal Java Architect, Security Architect, Product Manager  

---

## 1. Document Control & Metadata

| Metadata Field | Specification Details |
| :--- | :--- |
| **Document Title** | CodeLens - User Management Architecture Specification |
| **Project Code** | `CODELENS-ENTERPRISE-PH8` |
| **Document Owner** | Enterprise Solution Architecture Board |
| **Target Audience** | Enterprise Architects, Backend Java Engineers, Frontend Engineers, QA Automation Leads, InfoSec Officers |
| **Review Cycle** | Phase Milestone Review / Post-Sprint Audit |
| **Effective Date** | July 2026 |

### 1.1 Revision History

| Version | Date | Author | Description of Changes | Review Status |
| :--- | :--- | :--- | :--- | :--- |
| **0.1.0-DRAFT** | 2026-07-18 | Architecture Team | Initial domain scoping and user component decomposition | In Review |
| **0.9.0-RC** | 2026-07-20 | Principal Java Lead | Integrated JPA entity boundary rules and RBAC integration | Pending |
| **1.0.0-RELEASE** | 2026-07-21 | CTO & Architecture Board | Finalized User Management Architecture baseline approved | **APPROVED** |

---

## 2. Purpose & Executive Summary

### 2.1 Purpose
The purpose of this **User Management Architecture Specification** is to define the structural design, data entity boundaries, service layer contracts, lifecycle state machines, security integrations, and UI/UX presentation patterns for the **User Management & Profile Module** of the **CodeLens** platform.

This document serves as the foundational architectural specification for Phase 8, ensuring that user identity metadata, user profile customization, preference management, account settings, activity tracking, and user administration adhere to Fortune 500 engineering standards.

### 2.2 Executive Summary
The User Management Module is designed as a decoupled, cohesive subsystem within the CodeLens Spring Boot MVC monolith. It maintains a strict separation of concerns between core authentication credentials (`User` / `Account`) and extended user metadata (`UserProfile`, `UserPreferences`). Built on **Java 21, Spring Data JPA, MySQL 8.0, and Thymeleaf**, this architecture guarantees high performance, PII data protection, full auditability, and seamless future scalability toward OAuth2/OIDC identity providers.

---

## 3. System Architecture & Component Diagram

```
+---------------------------------------------------------------------------------------------------+
|                                 USER MANAGEMENT SUBSYSTEM BOUNDARY                                |
|                                                                                                   |
|  +---------------------------------------------------------------------------------------------+  |
|  |                            PRESENTATION TIER (SPRING MVC / THYMELEAF)                        |  |
|  |  UserController  |  ProfileController  |  PreferencesController  |  UserAdminController     |  |
|  +---------------------------------------------------------------------------------------------+  |
|                                                |                                                  |
|                                                v                                                  |
|  +---------------------------------------------------------------------------------------------+  |
|  |                           SERVICE & DOMAIN TIER (JAVA 21 & SPRING)                           |  |
|  |                                                                                             |  |
|  |  +-------------------------+    +-------------------------+    +-------------------------+  |  |
|  |  |   IUserService          |    |   IProfileService       |    |   IPreferenceService    |  |  |
|  |  +-------------------------+    +-------------------------+    +-------------------------+  |  |
|  |               |                              |                              |               |  |
|  |               v                              v                              v               |  |
|  |  +-------------------------+    +-------------------------+    +-------------------------+  |  |
|  |  |   IActivityAuditService |    |   INotificationService  |    |   IUserAdminService     |  |  |
|  |  +-------------------------+    +-------------------------+    +-------------------------+  |  |
|  +---------------------------------------------------------------------------------------------+  |
|                                                |                                                  |
|                                                v                                                  |
|  +---------------------------------------------------------------------------------------------+  |
|  |                        PERSISTENCE & DATA TIER (SPRING DATA JPA / MYSQL)                    |  |
|  |  UserRepository  |  UserProfileRepository  |  UserPreferencesRepository  |  UserAuditRepository |  |
|  +---------------------------------------------------------------------------------------------+  |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## 4. Domain Data Model & Entity Boundaries

To enforce high cohesion and prevent bloated domain entities, user data is normalized across five distinct entity boundaries:

```
               +-------------------+
               |       User        |  <-- Core Credentials & Status
               | (Authentication)  |
               +-------------------+
                         |
      +------------------+------------------+
      |                  |                  |
      v                  v                  v
+-----------+      +-----------+      +-----------+
|  User     |      |  User     |      |  User     |
|  Profile  |      |Preferences|      | AuditLog  |
+-----------+      +-----------+      +-----------+
```

### 4.1 Domain Entity Specifications

1. **`User` (Core Account Entity):** Contains immutable surrogate primary key (`id`), unique email, username, encrypted password hash (`password_hash`), account status enum (`PENDING`, `ACTIVE`, `SUSPENDED`, `LOCKED`), and relationship associations.
2. **`UserProfile` (Extended Metadata Entity):** Stores first name, last name, job title, department, avatar image URL, bio, github profile link, and organization unit.
3. **`UserPreferences` (System Customization Entity):** Manages UI theme selection (`LIGHT`, `DARK`, `SYSTEM`), code syntax highlighter theme, default code review display mode (`SIDE_BY_SIDE`, `INLINE`), notification digest settings, and language localization preferences.
4. **`AccountSettings` (Security & Privacy Entity):** Controls two-factor authentication (2FA) status, API access key tokens, email notification toggles, and session inactivity timeout limits.
5. **`UserActivityAudit` (Historical Log Entity):** Maintains immutable timestamped records of user logins, password modifications, profile updates, role privilege shifts, and administrative interventions.

---

## 5. Service Layer Contracts & Responsibilities

| Service Interface | Architectural Responsibility | Primary Operations |
| :--- | :--- | :--- |
| **`IUserService`** | Core account lifecycle & state transitions. | `createUser()`, `deactivateUser()`, `lockUser()`, `findUserByEmail()` |
| **`IUserProfileService`** | User metadata retrieval & updates. | `getProfileByUserId()`, `updateProfile()`, `uploadAvatar()` |
| **`IUserPreferenceService`**| UI/UX preference customization. | `getPreferences()`, `updateTheme()`, `updateDiffViewMode()` |
| **`IUserAuditService`** | Immutable user activity tracking. | `logActivity()`, `getUserActivityHistory()`, `exportAuditLogs()` |
| **`IUserAdminService`** | System administrator user management. | `searchUsers()`, `assignRole()`, `revokePrivileges()`, `bulkStatusUpdate()` |

---

## 6. Security, Authorization & Privacy Integration

- **Role-Based Access Control (RBAC):** Method-level authorization via Spring Security `@PreAuthorize("hasRole('ADMIN') or #userId == principal.id")`.
- **Self-Service Privacy Boundary:** Users can only view and modify their own `UserProfile`, `UserPreferences`, and `AccountSettings`.
- **PII Data Protection:** Sensitive PII fields (phone numbers, full names, corporate email) are encrypted at rest using AES-256 JPA attribute converters.
- **Soft-Delete Anonymization:** When a user account is deleted, PII fields are scrubbed while retaining anonymized ID associations for historical code review audit integrity.

---

## 7. Architecture Decision Records (ADRs)

### ADR-PH8-001: Separation of `User` Account Credentials from `UserProfile`
- **Status:** **ACCEPTED**
- **Context:** Storing extended profile metadata inside the core `User` entity causes unnecessary database memory overhead during simple authentication checks.
- **Decision:** Split core authentication credentials (`User`) and profile metadata (`UserProfile`) into separate JPA entities connected via a `@OneToOne` lazy-loaded relationship.
- **Consequences:** Accelerates user login queries by loading only credential fields while isolating optional profile metadata.

### ADR-PH8-002: Event-Driven User Activity Audit Logging
- **Status:** **ACCEPTED**
- **Context:** Synchronous database logging of user activity during HTTP requests degrades application latency.
- **Decision:** Implement Spring `@EventListener` and `@Async` Virtual Thread handlers to process user activity logs asynchronously.
- **Consequences:** Near-zero impact on user request latency; audit logs are dispatched asynchronously to MySQL persistence.

---

## 8. Enterprise Recommendations & Best Practices

1. **Java 21 Immutable DTO Records:** All request/response payloads (e.g., `UserProfileResponseRecord`, `UpdatePreferencesRequestRecord`) must be implemented as immutable Java 21 `record` types.
2. **Fail-Fast Input Validation:** Enforce strict Jakarta Bean Validation annotations (`@Email`, `@Size`, `@Pattern`) on all incoming user management forms at the controller layer.
3. **Thymeleaf UI Layout Reusability:** Standardize user settings navigation panels into a single reusable Thymeleaf fragment (`templates/user/fragments/settings-nav.html`).

---

## 9. Strategic Risk & Mitigation Register

| Risk ID | Identified Risk Event | Severity | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **RSK-PH8-01** | Avatar File Upload Malicious Payload | **HIGH** | Strict file extension validation (`.jpg`, `.png`), image MIME type checking, and file size limits (2MB max). |
| **RSK-PH8-02** | Unbounded User Search Query Lag | **MEDIUM** | Implement paginated search endpoints (`Pageable`) with composite B-Tree indexes on `email`, `last_name`, and `status`. |

---

## 10. Document Review & Sign-Off Matrix

Before proceeding to sub-module detailed specifications, designated leadership must approve this architecture baseline:

- [x] Scope, assumptions, constraints, and dependencies explicitly defined.
- [x] Domain entities (`User`, `UserProfile`, `UserPreferences`, `UserAudit`) mapped.
- [x] Service contracts and RBAC authorization boundaries documented.
- [x] ADRs for Entity Separation and Event-Driven Auditing accepted.
- [x] References to Phase 1 System Architecture (`docs/architecture/01_SYSTEM_ARCHITECTURE.md`) verified.

| Governance Role | Name / Title | Decision Status | Date |
| :--- | :--- | :--- | :--- |
| **Enterprise Program Manager** | Software Delivery Director | **APPROVED** | July 21, 2026 |
| **Principal Software Architect** | Chief Architect | **APPROVED** | July 21, 2026 |
| **Chief Technology Officer (CTO)**| CTO | **APPROVED** | July 21, 2026 |
| **Principal Java Architect** | Head of Java Engineering | **APPROVED** | July 21, 2026 |
| **Principal Security Architect**| CISO | **APPROVED** | July 21, 2026 |

---

## 11. Related Phase Architecture References

- System Architecture: [`docs/architecture/01_SYSTEM_ARCHITECTURE.md`](file:///home/mohammad-ali/Projects/CodeLens/docs/architecture/01_SYSTEM_ARCHITECTURE.md)
- Database Overview: [`docs/database/01_DATABASE_OVERVIEW.md`](file:///home/mohammad-ali/Projects/CodeLens/docs/database/01_DATABASE_OVERVIEW.md)
- Security Architecture: [`docs/security/01_IAM_OVERVIEW.md`](file:///home/mohammad-ali/Projects/CodeLens/docs/security/01_IAM_OVERVIEW.md)
