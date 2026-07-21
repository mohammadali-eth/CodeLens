# Document 01: Database Overview & Data Architecture Specification

**Project Name:** CodeLens – AI-Powered Code Review Platform  
**Document ID:** CL-DB-01  
**Version:** 1.0.0-RELEASE  
**Classification:** Enterprise Internal Confidential Architecture Standard  
**Authors:** Principal Database Architect, Enterprise Data Modeler, MySQL Expert, Data Governance Lead  

---

## 1. Document Control & Metadata

| Metadata Field | Specification Details |
| :--- | :--- |
| **Document Title** | CodeLens - Enterprise Database Overview & Architecture Specification |
| **Project Code** | `CODELENS-ENTERPRISE-DB` |
| **Document Owner** | Enterprise Data Governance & Architecture Board (EDGAB) |
| **Target Audience** | Database Architects, Data Engineers, Java Enterprise Developers, Security Officers, DBA Team |
| **Review Cycle** | Quarterly / Major Schema Release Review |
| **Effective Date** | July 2026 |

### 1.1 Stakeholder & Governance Matrix

| Role | Representative | Primary Database Interest |
| :--- | :--- | :--- |
| **Principal Database Architect** | Architecture Office | Data modeling integrity, ACID compliance, normalization (3NF) |
| **MySQL Expert / DBA Lead** | Infrastructure Operations | Query performance, InnoDB buffer pool tuning, backups, replication |
| **Enterprise Data Modeler** | System Analysis | Relational mapping, JPA entity alignment, schema evolution |
| **Data Governance Lead** | InfoSec & Compliance | Audit logging, soft-delete governance, PII protection, encryption |

### 1.2 Revision History

| Version | Date | Author | Description of Change | Review Status |
| :--- | :--- | :--- | :--- | :--- |
| **0.1.0-DRAFT** | 2026-07-17 | Data Modeler | Initial database domain scoping and conceptual boundaries | In Review |
| **0.9.0-RC** | 2026-07-20 | Principal DB Architect | Integrated Spring Data JPA compatibility and MySQL 8 InnoDB settings | Pending |
| **1.0.0-RELEASE** | 2026-07-21 | Data Governance Board | Baseline relational database overview approved | **APPROVED** |

---

## 2. Purpose & Executive Summary

### 2.1 Purpose
The purpose of this **Database Overview** document is to establish the overarching architectural blueprint, governance guidelines, performance baselines, and technical standards for the **CodeLens** relational database ecosystem.

This document serves as the foundational reference for database developers, enterprise Java developers, and DBAs, ensuring that all database schemas, table relationships, index strategies, and data lifecycles strictly align with MySQL 8.0 best practices and Spring Data JPA / Hibernate ORM standards.

### 2.2 Executive Summary
The CodeLens database is engineered as an enterprise-grade, highly reliable, ACID-compliant relational data store built on **MySQL 8.0 Enterprise Server using the InnoDB Storage Engine**. It provides multi-tenant ready relational persistence for user credentials, repository metadata, AI-generated code reviews, vulnerability findings, complexity metrics, and audit histories.

```
+-----------------------------------------------------------------------------------+
|                        CODELENS ENTERPRISE DATABASE ARCHITECTURE                  |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  +---------------------------+                      +--------------------------+  |
|  |     SPRING DATA JPA       | <--- HikariCP --->   |    MYSQL 8.0 INNODB DB   |  |
|  |  Spring Boot Application  |      (TLS 1.3)       | (UTF8MB4, ACID Compliant)|  |
|  +---------------------------+                      +--------------------------+  |
|               |                                                  |                |
|               v                                                  v                |
|  +---------------------------+                      +--------------------------+  |
|  | Entity Cache / Hibernate  |                      | Primary / Replica        |  |
|  | (Optimistic Lock @Version)|                      | Automated Snapshot Engine|  |
|  +---------------------------+                      +--------------------------+  |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---

## 3. Business Scope & Database Vision

### 3.1 Business Scope
The CodeLens database models five core operational business domains:
1. **User Identity & Security (`DOMAIN-AUTH`):** Manages user accounts, roles, permission sets, session tokens, and security audit flags.
2. **Repository & Workspace Management (`DOMAIN-REPO`):** Tracks registered GitHub repositories, branches, commit metadata, and source file trees.
3. **AI Code Review Engine (`DOMAIN-REVIEW`):** Stores code snippet review jobs, Google Gemini LLM raw responses, diff suggestions, and refactoring actions.
4. **Code Quality & Security Metrics (`DOMAIN-METRICS`):** Records OWASP vulnerability scans, cyclomatic complexity scores, and style violation occurrences.
5. **System Audit & Governance (`DOMAIN-AUDIT`):** Maintains immutable historical logs of user actions, API token usages, and system configuration modifications.

### 3.2 Data Vision Statement
> *"To maintain a zero-data-loss, highly normalized, ultra-performant MySQL relational store that enforces strict data integrity, guarantees sub-10ms transactional read latency, and seamlessly supports Spring Data JPA object-relational mapping."*

---

## 4. Database Infrastructure & Technical Environment

| Database Attribute | Enterprise Technical Standard | Rationale & Justification |
| :--- | :--- | :--- |
| **RDBMS Engine** | **MySQL 8.0 Enterprise Server** | High performance, widespread enterprise adoption, mature JSON support, and online DDL capabilities. |
| **Storage Engine** | **InnoDB** | Supports ACID transactions, row-level locking, foreign key constraints, and crash recovery. |
| **Character Set** | `utf8mb4` | Full Unicode support including code symbols, emojis, and international text without truncation. |
| **Collation** | `utf8mb4_0900_ai_ci` | Default MySQL 8 collation providing fast, accent-insensitive, and case-insensitive comparisons. |
| **Connection Pooling** | **HikariCP** (Spring Boot Default) | Ultra-lightweight, high-concurrency JDBC connection pool with automatic validation. |
| **Timezone Standard** | **UTC (+00:00)** | Prevents daylight saving anomalies and simplifies cross-region timestamp conversions. |

---

## 5. Core Data Domains & Functional Subsystems

```
+-----------------------------------------------------------------------------------+
|                            CODELENS DATA DOMAIN TOPOLOGY                          |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  +-------------------------+            +--------------------------------------+  |
|  |  1. USER_SECURITY       |            |  2. REPOSITORY_MGMT                  |  |
|  |  users, roles, perms    |            |  repositories, branches, commits     |  |
|  +-------------------------+            +--------------------------------------+  |
|               |                                            |                      |
|               +----------------------+---------------------+                      |
|                                      |                                            |
|                                      v                                            |
|                         +--------------------------+                              |
|                         |  3. AI_REVIEW_ENGINE     |                              |
|                         |  reviews, snippets, diffs|                              |
|                         +--------------------------+                              |
|                                      |                                            |
|               +----------------------+---------------------+                      |
|               |                                            |                      |
|               v                                            v                      |
|  +-------------------------+            +--------------------------------------+  |
|  |  4. QUALITY_METRICS     |            |  5. AUDIT_COMPLIANCE                 |  |
|  |  owasp_scans, complexity|            |  audit_logs, system_events           |  |
|  +-------------------------+            +--------------------------------------+  |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---

## 6. High-Level Relational Topology (Conceptual Entity Flow)

- **`users`** (1) -------- (N) **`repositories`**: A user owns or manages multiple repositories.
- **`repositories`** (1) -------- (N) **`review_requests`**: A repository undergoes multiple AI code reviews.
- **`review_requests`** (1) -------- (1) **`ai_review_results`**: Each review request generates a detailed AI review outcome.
- **`ai_review_results`** (1) -------- (N) **`security_findings`**: An AI review result contains multiple OWASP security findings.
- **`ai_review_results`** (1) -------- (N) **`code_suggestions`**: An AI review result produces multiple refactoring suggestions.
- **`users`** (1) -------- (N) **`audit_logs`**: User actions generate immutable enterprise audit trails.

---

## 7. Spring Data JPA & Hibernate Integration Strategy

To ensure zero friction between the MySQL database and the Spring Boot backend:

1. **Surrogate Primary Keys:** All tables standardize on auto-incrementing BigInt or UUID surrogate primary keys (`BIGINT AUTO_INCREMENT`).
2. **Optimistic Locking (`@Version`):** Tables subject to concurrent updates (e.g., `review_requests`) incorporate a `version BIGINT` column to prevent lost updates without heavy database locks.
3. **Audit Fields Standard (`@CreatedDate`, `@LastModifiedDate`):** Every domain table contains `created_at`, `created_by`, `updated_at`, and `updated_by` fields managed automatically by Spring Data JPA Auditing.
4. **Explicit Foreign Key Constraints:** Hibernate auto-ddl is **DISABLED** in production (`spring.jpa.hibernate.ddl-auto=validate`). Schema generation is governed explicitly via Flyway/Liquibase migration scripts.

---

## 8. Data Governance, Security & Compliance Baseline

| Governance Metric | Standard Implementation | Security & Compliance Mechanism |
| :--- | :--- | :--- |
| **Data Encryption at Rest** | MySQL InnoDB Tablespace Encryption (AES-256) | Protects underlying disk data against physical theft or unauthorized filesystem read. |
| **Data Encryption in Transit**| TLS 1.3 for all JDBC connections | Prevents network eavesdropping and man-in-the-middle attacks between Spring Boot and MySQL. |
| **Secrets Protection** | PII & Secret Scrubbing before persistence | API tokens, private keys, and passwords inside code snippets are sanitized prior to storage. |
| **Soft Delete Policy** | `is_deleted TINYINT(1)` flag across all entity tables | Prevents physical data destruction, maintaining strict historical audit compliance. |

---

## 9. Database Performance & Scalability Baseline

1. **InnoDB Buffer Pool Allocation:** Dedicated MySQL instance allocates 70% of total system RAM to `innodb_buffer_pool_size`.
2. **Indexing Standard:** B-Tree composite indexes applied to all Foreign Key columns and high-cardinality search columns (`repository_id`, `created_at`, `status`).
3. **JSON Column Usage:** Store semi-structured Gemini API raw responses in native MySQL `JSON` columns to avoid schema alterations while preserving queryability using `JSON_EXTRACT()`.
4. **Future Sharding Roadmap:** Designed with `tenant_id` / `repository_id` partitioning keys to support zero-downtime database sharding as data volume grows.

---

## 10. Database Strategic Risk & Mitigation Register

| Risk ID | Identified Database Risk | Impact | Probability | Mitigation Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **RSK-DB-01** | High JSON Payload Storage Overhead | **MEDIUM** | **HIGH** | Compress raw Gemini JSON responses exceeding 50KB or offload to compressed secondary tables. |
| **RSK-DB-02** | Transaction Deadlocks on Async Reviews | **HIGH** | **LOW** | Enforce strict column update order and short transaction boundaries using `@Transactional(timeout = 5)`. |
| **RSK-DB-03** | Unindexed Query Performance Degradation | **HIGH** | **MEDIUM** | Enable MySQL Slow Query Log (`long_query_time = 1.0s`) and execute weekly `EXPLAIN` query audits. |

---

## 11. Database Governance Review & Sign-Off Matrix

Before proceeding to sub-architectural data models, the Database Governance Board must approve this overview baseline:

- [x] RDBMS engine, storage engine (InnoDB), character set (`utf8mb4`), and HikariCP pool defined.
- [x] All 5 core data domains (`AUTH`, `REPO`, `REVIEW`, `METRICS`, `AUDIT`) scoped.
- [x] Spring Data JPA / Hibernate integration standards (surrogate keys, `@Version`, FKs) established.
- [x] Encryption at rest, soft deletes, and slow query monitoring baselined.
- [x] Governance and sign-off table complete.

| Role | Name / Title | Decision Status | Date |
| :--- | :--- | :--- | :--- |
| **Principal Database Architect** | Head of Enterprise Data Architecture | **APPROVED** | July 21, 2026 |
| **MySQL Expert / Lead DBA** | Enterprise Database Infrastructure Lead | **APPROVED** | July 21, 2026 |
| **Enterprise Data Modeler** | Principal System Data Modeler | **APPROVED** | July 21, 2026 |
| **Data Governance Lead** | InfoSec & Data Compliance Director | **APPROVED** | July 21, 2026 |

---

## 12. Related Database Architecture Documents

- Document 02: Conceptual Data Model (`docs/database/02_CONCEPTUAL_DATA_MODEL.md`)
- Document 04: Physical Data Model (`docs/database/04_PHYSICAL_DATA_MODEL.md`)
- Document 05: ER Diagram Documentation (`docs/database/05_ER_DIAGRAM_DOCUMENTATION.md`)
- Document 16: Audit Strategy (`docs/database/16_AUDIT_STRATEGY.md`)
