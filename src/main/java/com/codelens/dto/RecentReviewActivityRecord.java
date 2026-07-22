package com.codelens.dto;

/**
 * Immutable Java 21 DTO Record representing a recent review activity item.
 */
public record RecentReviewActivityRecord(
        Long reviewId,
        String repositoryName,
        String language,
        Integer overallScore,
        String status,
        String createdAt
) {}
