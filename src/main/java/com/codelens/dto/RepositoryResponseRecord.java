package com.codelens.dto;

import java.time.LocalDateTime;

/**
 * Immutable Java 21 DTO Record for Repository responses.
 */
public record RepositoryResponseRecord(
        Long id,
        String name,
        String description,
        String programmingLanguage,
        Long ownerId,
        String ownerUsername,
        boolean isPublic,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
