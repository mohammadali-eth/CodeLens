package com.codelens.ai.dto;

/**
 * Immutable Java 21 DTO Record for encapsulating provider-agnostic AI review execution results.
 */
public record AiResponseRecord(
        String rawContent,
        int promptTokens,
        int completionTokens,
        long durationMs,
        String providerName,
        String modelName
) {}
