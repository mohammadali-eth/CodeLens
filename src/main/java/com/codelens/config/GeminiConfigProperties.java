package com.codelens.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

/**
 * Enterprise Configuration Bean for Google Gemini API integration.
 */
@Configuration
public class GeminiConfigProperties {

    @Value("${gemini.api.key:mock_key}")
    private String apiKey;

    @Value("${gemini.api.model:gemini-1.5-flash}")
    private String model;

    @Value("${gemini.api.endpoint:https://generativelanguage.googleapis.com/v1beta/models}")
    private String endpoint;

    @Value("${gemini.api.timeout-seconds:30}")
    private int timeoutSeconds;

    public String getApiKey() {
        return apiKey;
    }

    public String getModel() {
        return model;
    }

    public String getEndpoint() {
        return endpoint;
    }

    public int getTimeoutSeconds() {
        return timeoutSeconds;
    }

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank() && !"mock_key".equalsIgnoreCase(apiKey);
    }
}
