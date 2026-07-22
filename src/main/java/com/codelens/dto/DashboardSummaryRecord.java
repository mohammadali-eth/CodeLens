package com.codelens.dto;

import java.util.List;

/**
 * Immutable Java 21 DTO Record representing the aggregated Dashboard overview statistics.
 */
public record DashboardSummaryRecord(
        long totalRepositories,
        long totalReviews,
        long totalIssuesFound,
        double averageQualityScore,
        List<RecentReviewActivityRecord> recentReviews
) {}
