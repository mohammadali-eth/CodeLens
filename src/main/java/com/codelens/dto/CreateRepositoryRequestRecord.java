package com.codelens.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Immutable Java 21 DTO Record for creating a new repository.
 */
public record CreateRepositoryRequestRecord(
        @NotBlank(message = "Repository name is required")
        @Size(min = 2, max = 100, message = "Repository name must be between 2 and 100 characters")
        String name,

        @Size(max = 500, message = "Description must not exceed 500 characters")
        String description,

        @NotBlank(message = "Programming language is required")
        @Size(max = 50, message = "Language must not exceed 50 characters")
        String programmingLanguage,

        boolean isPublic
) {}
