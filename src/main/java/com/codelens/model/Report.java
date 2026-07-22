package com.codelens.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Enterprise JPA Entity representing generated static reports.
 */
@Entity
@Table(name = "reports", indexes = {
        @Index(name = "idx_report_owner", columnList = "owner_id"),
        @Index(name = "idx_report_type", columnList = "type"),
        @Index(name = "idx_report_created_at", columnList = "created_at")
})
@EntityListeners(AuditingEntityListener.class)
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @NotBlank
    @Column(name = "type", nullable = false, length = 50)
    private String type; // REPOSITORY_SUMMARY, SECURITY_AUDIT, USER_PERFORMANCE

    @NotBlank
    @Column(name = "status", nullable = false, length = 20)
    private String status; // GENERATING, COMPLETED, FAILED

    @Column(name = "query_criteria", length = 500)
    private String queryCriteria;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Lob
    @Column(name = "content", columnDefinition = "LONGTEXT")
    private String content;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Report() {
    }

    public Report(String name, String type, String status, String queryCriteria, User owner, String content) {
        this.name = name;
        this.type = type;
        this.status = status;
        this.queryCriteria = queryCriteria;
        this.owner = owner;
        this.content = content;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getQueryCriteria() {
        return queryCriteria;
    }

    public void setQueryCriteria(String queryCriteria) {
        this.queryCriteria = queryCriteria;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
