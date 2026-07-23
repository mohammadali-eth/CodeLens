package com.codelens.dto;

import java.util.List;

/**
 * Immutable Java 21 DTO Record representing the aggregated administrative overview and system metrics.
 */
public record AdminDashboardSummaryRecord(
        long totalUsers,
        long totalRepositories,
        long totalReviews,
        long activeSystemSessions,
        String databaseHealthStatus,
        List<AdminRecentActionRecord> recentSystemActions
) {}
