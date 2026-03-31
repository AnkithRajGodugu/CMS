package com.example.cms.config;

import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.redisson.jcache.configuration.RedissonConfiguration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

import javax.cache.CacheManager;
import javax.cache.Caching;
import javax.cache.spi.CachingProvider;

@Configuration
public class RateLimitConfig {

    @Value("${spring.data.redis.host:localhost}")
    private String redisHost;

    @Value("${spring.data.redis.port:6379}")
    private int redisPort;

    /**
     * Password is empty for local Docker Redis (no auth).
     * Set REDIS_PASSWORD env var for Upstash (production).
     */
    @Value("${spring.data.redis.password:}")
    private String redisPassword;

    /**
     * Set REDIS_SSL=true in production (Upstash requires TLS).
     * Local Docker Redis uses plain redis://.
     */
    @Value("${spring.data.redis.ssl.enabled:false}")
    private boolean redisSsl;

    @Bean
    public RedissonClient redissonClient() {
        Config config = new Config();

        // Use rediss:// (double-s) for TLS — required by Upstash
        String scheme = redisSsl ? "rediss://" : "redis://";
        String address = scheme + redisHost + ":" + redisPort;

        var singleServer = config.useSingleServer()
                .setAddress(address)
                .setConnectTimeout(10_000)
                .setTimeout(10_000)
                .setRetryAttempts(3)
                .setRetryInterval(1_500);

        // Inject password only when provided (Upstash / authenticated Redis)
        if (StringUtils.hasText(redisPassword)) {
            singleServer.setPassword(redisPassword);
        }

        return Redisson.create(config);
    }

    @Bean(name = "jCacheManager")
    public CacheManager jCacheManager(RedissonClient redissonClient) {
        CachingProvider provider = Caching.getCachingProvider(
                "org.redisson.jcache.JCachingProvider");
        CacheManager manager = provider.getCacheManager();

        if (manager.getCache("rate-limit-buckets") == null) {
            manager.createCache("rate-limit-buckets",
                    RedissonConfiguration.fromInstance(redissonClient));
        }

        return manager;
    }
}

