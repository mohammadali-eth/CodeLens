package com.codelens;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Enterprise Entry Point for CodeLens - AI-Powered Code Review Platform.
 * <p>
 * Standardizes application bootstrap, Spring container initialization,
 * and enables Spring Data JPA Auditing.
 * </p>
 *
 * @author Senior Enterprise Architecture Office
 * @version 1.0.0-RELEASE
 */
@SpringBootApplication
@EnableJpaAuditing
public class CodeLensApplication {

    private static final Logger log = LoggerFactory.getLogger(CodeLensApplication.class);

    public static void main(String[] args) {
        log.info("Starting CodeLens Enterprise Application Bootstrap Process...");
        SpringApplication.run(CodeLensApplication.class, args);
        log.info("CodeLens Application successfully initialized and ready to accept requests.");
    }
}
