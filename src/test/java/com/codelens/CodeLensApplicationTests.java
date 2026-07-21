package com.codelens;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Enterprise Integration Test verifying Spring Boot application context load.
 */
@SpringBootTest
@ActiveProfiles("test")
class CodeLensApplicationTests {

    @Test
    void contextLoads() {
        // Verifies Spring ApplicationContext initializes cleanly
    }
}
