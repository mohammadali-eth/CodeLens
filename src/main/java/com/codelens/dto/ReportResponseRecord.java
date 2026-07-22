package com.codelens.dto;

import java.time.LocalDateTime;

/**
 * Immutable Java 21 DTO Record representing summarized report metadata.
 */
public record ReportResponseRecord(
        Long id,
        String name,
        String type,
        String status,
        Long ownerId,
        String ownerUsername,
        LocalDateTime createdAt
) {}
