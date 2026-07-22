package com.codelens.model;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Enterprise JPA Entity representing an AI Code Review transaction.
 */
@Entity
@Table(name = "code_reviews", indexes = {
        @Index(name = "idx_review_repository", columnList = "repository_id"),
        @Index(name = "idx_review_status", columnList = "status"),
        @Index(name = "idx_review_created_at", columnList = "created_at")
})
@EntityListeners(AuditingEntityListener.class)
public class CodeReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "repository_id", nullable = false)
    private CodeRepository repository;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    @Column(name = "status", nullable = false, length = 20)
    private String status; // PENDING, COMPLETED, FAILED

    @Column(name = "overall_score")
    private Integer overallScore;

    @Column(name = "critical_issues_count")
    private Integer criticalIssuesCount = 0;

    @Column(name = "warning_issues_count")
    private Integer warningIssuesCount = 0;

    @Column(name = "analysis_duration_ms")
    private Long analysisDurationMs = 0L;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "codeReview", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CodeReviewIssue> issues = new ArrayList<>();

    public CodeReview() {
    }

    public CodeReview(CodeRepository repository, User reviewer, String status) {
        this.repository = repository;
        this.reviewer = reviewer;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CodeRepository getRepository() {
        return repository;
    }

    public void setRepository(CodeRepository repository) {
        this.repository = repository;
    }

    public User getReviewer() {
        return reviewer;
    }

    public void setReviewer(User reviewer) {
        this.reviewer = reviewer;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(Integer overallScore) {
        this.overallScore = overallScore;
    }

    public Integer getCriticalIssuesCount() {
        return criticalIssuesCount;
    }

    public void setCriticalIssuesCount(Integer criticalIssuesCount) {
        this.criticalIssuesCount = criticalIssuesCount;
    }

    public Integer getWarningIssuesCount() {
        return warningIssuesCount;
    }

    public void setWarningIssuesCount(Integer warningIssuesCount) {
        this.warningIssuesCount = warningIssuesCount;
    }

    public Long getAnalysisDurationMs() {
        return analysisDurationMs;
    }

    public void setAnalysisDurationMs(Long analysisDurationMs) {
        this.analysisDurationMs = analysisDurationMs;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public List<CodeReviewIssue> getIssues() {
        return issues;
    }

    public void addIssue(CodeReviewIssue issue) {
        issues.add(issue);
        issue.setCodeReview(this);
    }
}
