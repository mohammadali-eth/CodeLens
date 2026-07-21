package com.codelens.ai.dto;

/**
 * Immutable Java 21 DTO Record for encapsulating provider-agnostic AI review requests.
 */
public record AiRequestRecord(
        String systemInstruction,
        String prompt,
        double temperature,
        int maxOutputTokens
) {
    public AiRequestRecord {
        if (temperature < 0.0 || temperature > 2.0) {
            temperature = 0.2; // Default low temperature for deterministic code analysis
        }
        if (maxOutputTokens <= 0) {
            maxOutputTokens = 4096;
        }
    }
}
