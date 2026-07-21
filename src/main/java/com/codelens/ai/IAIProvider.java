package com.codelens.ai;

import com.codelens.ai.dto.AiRequestRecord;
import com.codelens.ai.dto.AiResponseRecord;

/**
 * Strategy interface providing provider-agnostic abstraction for AI models.
 */
public interface IAIProvider {

    /**
     * Executes code review generation request.
     *
     * @param request Provider-agnostic AI request configuration
     * @return AiResponseRecord containing raw response text and token usage metrics
     */
    AiResponseRecord generateCodeReview(AiRequestRecord request);

    /**
     * Identifies the AI provider type.
     *
     * @return AiProviderType enum
     */
    AiProviderType getProviderType();

    /**
     * Checks if the AI provider is configured and available.
     *
     * @return boolean indicator
     */
    boolean isAvailable();
}
