# Document 01: Identity & Access Management (IAM) Overview & Security Architecture

**Project Name:** CodeLens – AI-Powered Code Review Platform  
**Document ID:** CL-SEC-01  
**Version:** 1.0.0-RELEASE  
**Classification:** Enterprise Security Architecture Standard (RESTRICTED)  
**Authors:** Principal Security Architect, IAM Architect, Spring Security Expert, Enterprise Java Architect, Application Security Engineer  

---

## 1. Document Control & Metadata

| Metadata Field | Specification Details |
| :--- | :--- |
| **Document Title** | CodeLens - Identity & Access Management Overview & Security Blueprint |
| **Project Code** | `CODELENS-ENTERPRISE-SEC` |
| **Document Owner** | Enterprise Information Security & Risk Governance Board (EISRGB) |
| **Target Audience** | Security Architects, IAM Leads, Spring Developers, DevOps Engineers, InfoSec Auditors |
| **Review Cycle** | Quarterly / Mandatory Post-Incident Review |
| **Effective Date** | July 2026 |

### 1.1 Stakeholder & Security Governance Matrix

| Stakeholder Role | Representative | Primary Security Responsibility |
| :--- | :--- | :--- |
| **Principal Security Architect** | InfoSec Office | Overall threat modeling, Zero-Trust compliance, OWASP Top 10 mitigation |
| **IAM Architect** | Identity Operations | User credential lifecycle, role permissions, password policies, SSO roadmap |
| **Spring Security Expert** | Backend Engineering | `SecurityFilterChain` implementation, CSRF defense, session management |
| **Application Security Engineer**| AppSec Team | SAST/DAST scanning, security audit logging, input/output encoding |

### 1.2 Revision History

| Version | Date | Author | Description of Change | Review Status |
| :--- | :--- | :--- | :--- | :--- |
| **0.1.0-DRAFT** | 2026-07-17 | AppSec Lead | Initial security baseline and authentication framework design | In Review |
| **0.9.0-RC** | 2026-07-20 | IAM Architect | Integrated RBAC hierarchy, BCrypt hashing standards, and OWASP defenses | Pending |
| **1.0.0-RELEASE** | 2026-07-21 | Security Board | Finalized enterprise IAM overview baseline approved | **APPROVED** |

---

## 2. Executive Summary & Purpose

### 2.1 Purpose
The purpose of this **Identity & Access Management (IAM) Overview** document is to define the holistic security architecture, authentication policies, authorization hierarchies, credential handling guidelines, and threat mitigation baselines for **CodeLens – AI-Powered Code Review Platform**.

As an enterprise code review platform processing sensitive client repositories, internal IP, and security vulnerability metrics, CodeLens requires a Zero-Trust security foundation. This document establishes the technical governance governing **Spring Security 6.x**, password security, RBAC enforcement, session lifecycle, audit trails, and OWASP Top 10 defenses.

### 2.2 Security Architecture Mission Statement
> *"To enforce an uncompromised, defense-in-depth Identity and Access Management framework powered by Spring Security—protecting enterprise source code assets, guaranteeing strict role separation, and mitigating application vulnerabilities without impeding developer velocity."*

---

## 3. Enterprise Security Architecture Blueprint

```
+---------------------------------------------------------------------------------------------------+
|                                 CODELENS SECURITY BOUNDARY & IAM TIER                              |
|                                                                                                   |
|  +---------------------------------------------------------------------------------------------+  |
|  |                            HTTP / HTTPS USER EDGE PROTECTION                                 |  |
|  |  TLS 1.3 Encryption  |  OWASP Security Headers (HSTS, CSP, X-Frame)  |  Strict CSRF Tokens    |  |
|  +---------------------------------------------------------------------------------------------+  |
|                                                |                                                  |
|                                                v                                                  |
|  +---------------------------------------------------------------------------------------------+  |
|  |                         SPRING SECURITY 6.X FILTER CHAIN PIPELINE                          |  |
|  |                                                                                             |  |
|  |  +------------------------+   +------------------------+   +-----------------------------+  |  |
|  |  |  CorsFilter            |   |  CsrfFilter            |   | UsernamePasswordAuthFilter  |  |  |
|  |  +------------------------+   +------------------------+   +-----------------------------+  |  |
|  |              |                            |                                |                |  |
|  |              v                            v                                v                |  |
|  |  +------------------------+   +------------------------+   +-----------------------------+  |  |
|  |  | ExceptionTranslation   |   | AuthorizationFilter    |   | SessionManagementFilter     |  |  |
|  |  | Filter (401/403)       |   | (RBAC & Authorities)   |   | (Fixation Protection / TTL) |  |  |
|  |  +------------------------+   +------------------------+   +-----------------------------+  |  |
|  +---------------------------------------------------------------------------------------------+  |
|                                                |                                                  |
|                                                v                                                  |
|  +---------------------------------------------------------------------------------------------+  |
|  |                         ENTERPRISE IDENTITY & PERSISTENCE TIER                              |  |
|  |  BCrypt Password Hasher (Cost 12)  |  MySQL `users` & `roles`  |  Security Audit Logger     |  |
|  +---------------------------------------------------------------------------------------------+  |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## 4. Core IAM Subsystems & Functional Domains

CodeLens security architecture is partitioned into five distinct IAM domains:

| IAM Subsystem Domain | Core Security Function | Enterprise Standard Implementation |
| :--- | :--- | :--- |
| **1. Authentication Engine** | Verifies user identity via credentials. | Spring Security `DaoAuthenticationProvider` + BCrypt Password Encoder (Cost 12). |
| **2. Authorization & RBAC** | Enforces resource access privileges. | Hierarchical Spring Security Authorities (`ROLE_ADMIN`, `ROLE_LEAD`, `ROLE_DEV`, `ROLE_AUDITOR`). |
| **3. Session Lifecycle Manager**| Controls stateful session security. | Concurrent session limits (1 active session per user), session fixation protection, and 30-minute idle TTL. |
| **4. Account Lifecycle Manager**| Governs registration, lockouts, resets. | Failed login threshold (5 attempts = account lockout), email token reset workflow. |
| **5. Security Audit Logging** | Immutable tracking of security events. | Asynchronous Spring Event listener capturing login success/failure, privilege escalation, and access violations. |

---

## 5. OWASP Top 10 (2021) Security Alignment Matrix

CodeLens preemptively integrates mitigations against all OWASP Top 10 application security risks:

| OWASP Risk Category | Primary Vulnerability Description | CodeLens Architectural Mitigation Strategy |
| :--- | :--- | :--- |
| **A01:2021 - Broken Access Control** | Unauthorized access to repos/reviews. | Strict Spring Security `@PreAuthorize` method annotations + URL filter pattern checks. |
| **A02:2021 - Cryptographic Failures** | Plaintext exposure of keys/passwords. | BCrypt cost factor 12 for passwords; TLS 1.3 in transit; AES-256 for database secrets. |
| **A03:2021 - Injection** | SQLi, Command Injection in code diffs. | Spring Data JPA parameterized queries (No native dynamic SQL strings); sanitized Gemini inputs. |
| **A04:2021 - Insecure Design** | Weak password policies or reset flaws. | Mandatory complex passwords (12+ chars), rate-limited password reset tokens (15-min expiry). |
| **A05:2021 - Security Misconfiguration** | Unneeded features, default headers. | Hardened Spring Security headers (`X-Content-Type-Options`, `Content-Security-Policy`, `HSTS`). |
| **A06:2021 - Vulnerable Components** | Outdated Maven dependencies. | Automated GitHub Dependabot & OWASP Dependency-Check Maven plugin scans in CI/CD. |
| **A07:2021 - Auth & ID Failures** | Brute force, credential stuffing. | Progressive account lockout (5 failed attempts), CAPTCHA trigger, session fixation renewal. |
| **A08:2021 - Software & Data Integrity**| Unsafe deserialization or tampering. | Strict Jackson JSON deserialization rules; signed database migration scripts (Flyway). |
| **A09:2021 - Security Logging Failures**| Missing audit logs for breaches. | Immutable `security_audit_log` table storing IP address, user ID, timestamp, and event outcome. |
| **A10:2021 - SSRF** | Server-Side Request Forgery via LLM. | Strictly outbound-only HTTPS client wrapper for Google Gemini API with whitelist validation. |

---

## 6. Spring Security 6.x Integration Architecture

```
                                +-----------------------------+
                                | Incoming HTTP Request (MVC) |
                                +-----------------------------+
                                               |
                                               v
                                +-----------------------------+
                                | SecurityFilterChain Bean    |
                                +-----------------------------+
                                               |
                     +-------------------------+-------------------------+
                     |                                                   |
                     v                                                   v
      +-----------------------------+                     +-----------------------------+
      | Unauthenticated Access Path |                     | Authenticated Resource Path |
      | (/login, /register, /static)|                     | (/dashboard, /review/**)    |
      +-----------------------------+                     +-----------------------------+
                     |                                                   |
                     v                                                   v
      +-----------------------------+                     +-----------------------------+
      | PermitAll Authorization     |                     | Check SecurityContextHolder |
      | Render Login/Register View  |                     | Enforce @PreAuthorize Rules |
      +-----------------------------+                     +-----------------------------+
                                                                         |
                                                                         v
                                                          +-----------------------------+
                                                          | Access Granted / Denied     |
                                                          | (200 OK or 403 Forbidden)   |
                                                          +-----------------------------+
```

---

## 7. Strategic Security Decision Records (ADRs)

### ADR-SEC-01: Adoption of BCrypt Password Hashing with Cost Factor 12
- **Status:** **ACCEPTED**
- **Context:** Storing raw or weakly hashed (MD5/SHA1/SHA256) passwords violates enterprise compliance and exposes users to rainbow table attacks.
- **Decision:** Standardize on Spring Security `BCryptPasswordEncoder` set to cost factor 12 (approx. 250ms hashing time per credential verification).
- **Consequences:** Provides high computational resistance against offline GPU brute-force attacks while maintaining acceptable login latency.

### ADR-SEC-02: Synchronizer Token Pattern for CSRF Protection
- **Status:** **ACCEPTED**
- **Context:** Spring Boot MVC with Thymeleaf uses stateful browser session cookies, making forms vulnerable to Cross-Site Request Forgery (CSRF).
- **Decision:** Enable Spring Security default `HttpSessionCsrfTokenRepository`. Inject `th:action` auto-generated hidden `_csrf` tokens in all HTML forms.
- **Consequences:** Complete elimination of unauthorized form submission attacks from cross-domain origins.

---

## 8. Strategic Security Risk & Threat Register

| Threat ID | Identified Security Risk | Severity | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **TR-SEC-01** | Session Hijacking via Stolen Cookies | **HIGH** | Set session cookies with `HttpOnly`, `Secure` (TLS 1.3 only), and `SameSite=Strict` attributes. |
| **TR-SEC-02** | Credential Stuffing & Password Spraying | **HIGH** | Lock account for 15 minutes after 5 consecutive failed authentication attempts within 10 minutes. |
| **TR-SEC-03** | Privilege Escalation in Repository Reviews | **HIGH** | Enforce method-level security (`@PreAuthorize("hasRole('ADMIN') or @repoSecurity.isOwner(#repoId)")`). |

---

## 9. Security Governance Review & Sign-Off Matrix

Before baseline security deployment, the designated Information Security Board must approve this specification:

- [x] Spring Security 6.x architecture and `SecurityFilterChain` pipeline defined.
- [x] BCrypt cost factor 12 password hashing policy established.
- [x] Hierarchical RBAC authorities (`ADMIN`, `LEAD`, `DEV`, `AUDITOR`) mapped.
- [x] OWASP Top 10 (2021) mitigations explicitly documented.
- [x] CSRF synchronizer tokens and secure HTTP headers mandated.
- [x] All 25 IAM and Security document scopes outlined.

| Security Governance Role | Name / Title | Decision Status | Date |
| :--- | :--- | :--- | :--- |
| **Principal Security Architect** | Chief Information Security Officer (CISO) | **APPROVED** | July 21, 2026 |
| **IAM Architect** | Lead Identity & Access Architect | **APPROVED** | July 21, 2026 |
| **Spring Security Expert** | Principal Java Security Architect | **APPROVED** | July 21, 2026 |
| **Application Security Lead**| Head of Application Security (AppSec) | **APPROVED** | July 21, 2026 |

---

## 10. Related Security Architecture Documents

- Document 02: Authentication Architecture (`docs/security/02_AUTHENTICATION_ARCHITECTURE.md`)
- Document 03: Authorization Architecture (`docs/security/03_AUTHORIZATION_ARCHITECTURE.md`)
- Document 14: Spring Security Architecture (`docs/security/14_SPRING_SECURITY_ARCHITECTURE.md`)
- Document 23: Security Threat Model (`docs/security/23_SECURITY_THREAT_MODEL.md`)
