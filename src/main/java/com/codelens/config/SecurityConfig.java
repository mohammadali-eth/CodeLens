package com.codelens.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.XXssProtectionHeaderWriter;

/**
 * Enterprise Spring Security 6.x Infrastructure Configuration.
 * <p>
 * Standardizes security filter pipeline, BCrypt password hashing (Cost 12),
 * AuthenticationManager exposure, session management, and HTTP security headers.
 * </p>
 *
 * @author Senior Enterprise Security Architecture Office
 * @version 1.0.0-RELEASE
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true, jsr250Enabled = true)
public class SecurityConfig {

    private static final Logger log = LoggerFactory.getLogger(SecurityConfig.class);

    private static final String[] PUBLIC_STATIC_RESOURCES = {
            "/css/**",
            "/js/**",
            "/images/**",
            "/webjars/**",
            "/favicon.ico"
    };

    private static final String[] PUBLIC_ENDPOINTS = {
            "/",
            "/login",
            "/register",
            "/error",
            "/actuator/health",
            "/actuator/info"
    };

    /**
     * In-memory User Details Manager for local development and UI demonstrations.
     */
    @Bean
    public UserDetailsService userDetailsService() {
        log.info("Initializing In-Memory UserDetailsService with default development users...");
        var adminUser = User.withUsername("admin")
                .password(passwordEncoder().encode("admin"))
                .roles("ADMIN", "LEAD", "DEV")
                .build();
        var devUser = User.withUsername("user")
                .password(passwordEncoder().encode("password"))
                .roles("DEV")
                .build();
        return new InMemoryUserDetailsManager(adminUser, devUser);
    }

    /**
     * Standard BCrypt Password Encoder with cost factor 12.
     * Provides high computational resistance against brute-force attacks.
     *
     * @return PasswordEncoder bean instance
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        log.info("Initializing BCryptPasswordEncoder with strength cost factor 12...");
        return new BCryptPasswordEncoder(12);
    }

    /**
     * Exposes the standard Spring Security AuthenticationManager bean for authentication processing.
     *
     * @param authenticationConfiguration Spring Security AuthenticationConfiguration
     * @return AuthenticationManager instance
     * @throws Exception if authentication manager cannot be obtained
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    /**
     * Configures the main Spring Security Filter Chain pipeline.
     *
     * @param http HttpSecurity configuration object
     * @return SecurityFilterChain instance
     * @throws Exception if security filter chain configuration fails
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        log.info("Configuring Enterprise Spring Security Filter Chain Pipeline...");

        http
            // 1. Configure URL Authorization Rules
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(PUBLIC_STATIC_RESOURCES).permitAll()
                .requestMatchers(PUBLIC_ENDPOINTS).permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/review/**").hasAnyRole("ADMIN", "LEAD", "DEV")
                .anyRequest().authenticated()
            )

            // 2. Configure Form Login
            .formLogin(form -> form
                .loginPage("/login")
                .loginProcessingUrl("/login")
                .defaultSuccessUrl("/dashboard", true)
                .failureUrl("/login?error=true")
                .permitAll()
            )

            // 3. Configure Logout Policy
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login?logout=true")
                .invalidateHttpSession(true)
                .clearAuthentication(true)
                .deleteCookies("JSESSIONID", "remember-me")
                .permitAll()
            )

            // 4. Session Management Strategy
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                .sessionFixation(sessionFixation -> sessionFixation.migrateSession())
                .maximumSessions(1)
                .maxSessionsPreventsLogin(false)
            )

            // 5. Enterprise HTTP Security Headers (OWASP Aligned)
            .headers(headers -> headers
                .frameOptions(HeadersConfigurer.FrameOptionsConfig::deny)
                .xssProtection(xss -> xss.headerValue(XXssProtectionHeaderWriter.HeaderValue.ENABLED_MODE_BLOCK))
                .contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'"))
                .httpStrictTransportSecurity(hsts -> hsts
                    .includeSubDomains(true)
                    .maxAgeInSeconds(31536000)
                )
            );

        return http.build();
    }
}
