package com.codelens.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Immutable Java 21 DTO Record representing request payload to generate a report.
 */
public record GenerateReportRequestRecord(
        @NotBlank(message = "Report name is required")
        @Size(max = 150, message = "Report name must not exceed 150 characters")
        String name,

        @NotBlank(message = "Report type is required")
        String type, // REPOSITORY_SUMMARY, SECURITY_AUDIT, USER_PERFORMANCE

        Long repositoryId
) {}
