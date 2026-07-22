package com.codelens.model;

import jakarta.persistence.*;

/**
 * Enterprise JPA Entity representing an individual issue identified during an AI Code Review.
 */
@Entity
@Table(name = "code_review_issues", indexes = {
        @Index(name = "idx_issue_review", columnList = "code_review_id"),
        @Index(name = "idx_issue_category", columnList = "category"),
        @Index(name = "idx_issue_severity", columnList = "severity")
})
public class CodeReviewIssue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "code_review_id", nullable = false)
    private CodeReview codeReview;

    @Column(name = "category", nullable = false, length = 50)
    private String category; // SECURITY, PERFORMANCE, COMPLEXITY, STYLE

    @Column(name = "severity", nullable = false, length = 20)
    private String severity; // CRITICAL, WARNING, INFO

    @Column(name = "file_path", nullable = false, length = 255)
    private String filePath;

    @Column(name = "line_number", nullable = false)
    private Integer lineNumber;

    @Column(name = "message", nullable = false, length = 1000)
    private String message;

    @Column(name = "snippet", length = 2000)
    private String snippet;

    public CodeReviewIssue() {
    }

    public CodeReviewIssue(String category, String severity, String filePath, Integer lineNumber, String message) {
        this.category = category;
        this.severity = severity;
        this.filePath = filePath;
        this.lineNumber = lineNumber;
        this.message = message;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CodeReview getCodeReview() {
        return codeReview;
    }

    public void setCodeReview(CodeReview codeReview) {
        this.codeReview = codeReview;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public Integer getLineNumber() {
        return lineNumber;
    }

    public void setLineNumber(Integer lineNumber) {
        this.lineNumber = lineNumber;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSnippet() {
        return snippet;
    }

    public void setSnippet(String snippet) {
        this.snippet = snippet;
    }
}
