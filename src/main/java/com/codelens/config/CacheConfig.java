package com.codelens.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.cache.RedisCacheManagerBuilderCustomizer;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

/**
 * Enterprise Cache Configuration enabling Redis cache management with fail-safe memory backoff.
 */
@Configuration
@EnableCaching
public class CacheConfig {

    private static final Logger log = LoggerFactory.getLogger(CacheConfig.class);

    public static final String CACHE_REPOS = "repositories";
    public static final String CACHE_DASHBOARD = "dashboard_metrics";
    public static final String CACHE_USER_PROFILES = "user_profiles";

    /**
     * Primary Cache Manager fallback. If RedisConnectionFactory is not reachable or fails,
     * Spring Boot can inject the in-memory cache manager.
     */
    @Bean
    @Primary
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        try {
            log.info("Initializing Enterprise Redis Cache Manager...");
            RedisCacheConfiguration defaultCacheConfig = RedisCacheConfiguration.defaultCacheConfig()
                    .entryTtl(Duration.ofMinutes(30))
                    .disableCachingNullValues()
                    .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                    .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer()));

            // Setup custom TTL mappings per cache zone
            Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();
            cacheConfigurations.put(CACHE_REPOS, defaultCacheConfig.entryTtl(Duration.ofHours(1)));
            cacheConfigurations.put(CACHE_DASHBOARD, defaultCacheConfig.entryTtl(Duration.ofMinutes(5)));
            cacheConfigurations.put(CACHE_USER_PROFILES, defaultCacheConfig.entryTtl(Duration.ofHours(2)));

            return RedisCacheManager.builder(connectionFactory)
                    .cacheDefaults(defaultCacheConfig)
                    .withInitialCacheConfigurations(cacheConfigurations)
                    .build();
        } catch (Exception e) {
            log.warn("Failed to initialize Redis connection factory. Falling back to local in-memory ConcurrentMap Cache Manager.", e);
            return new ConcurrentMapCacheManager(CACHE_REPOS, CACHE_DASHBOARD, CACHE_USER_PROFILES);
        }
    }
}
