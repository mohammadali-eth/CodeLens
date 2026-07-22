package com.codelens.dto;

import java.time.LocalDateTime;

/**
 * Immutable Java 21 DTO Record representing full details and content of a generated report.
 */
public record ReportDetailsResponseRecord(
        Long id,
        String name,
        String type,
        String status,
        String content,
        LocalDateTime createdAt
) {}
