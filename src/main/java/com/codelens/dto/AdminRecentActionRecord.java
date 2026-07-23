package com.codelens.dto;

/**
 * Immutable Java 21 DTO Record representing a recent administrative or system event.
 */
public record AdminRecentActionRecord(
        String actionType,
        String initiatedBy,
        String status,
        String timestamp
) {}
