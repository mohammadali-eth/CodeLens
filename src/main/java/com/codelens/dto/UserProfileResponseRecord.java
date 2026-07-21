package com.codelens.dto;

import java.time.LocalDateTime;

/**
 * Immutable Java 21 DTO Record for User Profile response data.
 */
public record UserProfileResponseRecord(
        Long userId,
        String username,
        String email,
        String firstName,
        String lastName,
        String jobTitle,
        String department,
        String avatarUrl,
        String bio,
        String githubProfileUrl,
        LocalDateTime createdAt
) {}
