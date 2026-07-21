package com.codelens.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Immutable Java 21 DTO Record for User Profile update requests.
 */
public record UpdateProfileRequestRecord(
        @NotBlank(message = "First name is required")
        @Size(max = 50, message = "First name must not exceed 50 characters")
        String firstName,

        @NotBlank(message = "Last name is required")
        @Size(max = 50, message = "Last name must not exceed 50 characters")
        String lastName,

        @Size(max = 100, message = "Job title must not exceed 100 characters")
        String jobTitle,

        @Size(max = 100, message = "Department must not exceed 100 characters")
        String department,

        @Size(max = 500, message = "Bio must not exceed 500 characters")
        String bio,

        @Size(max = 255, message = "GitHub profile URL must not exceed 255 characters")
        String githubProfileUrl
) {}
