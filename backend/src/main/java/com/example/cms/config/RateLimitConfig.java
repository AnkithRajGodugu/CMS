package com.example.cms.config;

import org.redisson.Redisson;

import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.redisson.jcache.configuration.RedissonConfiguration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.cache.CacheManager;
import javax.cache.Caching;
import javax.cache.spi.CachingProvider;

@Configuration
public class RateLimitConfig {

    @Value("${spring.data.redis.host:localhost}")
    private String redisHost;

    @Value("${spring.data.redis.port:6379}")
    private int redisPort;

    @Bean
    public RedissonClient redissonClient() {
        Config config = new Config();
        config.useSingleServer()
              .setAddress("redis://" + redisHost + ":" + redisPort);
        return Redisson.create(config);
    }

    @Bean(name = "jCacheManager")
    public CacheManager jCacheManager(RedissonClient redissonClient) {
        CachingProvider provider = Caching.getCachingProvider("org.redisson.jcache.JCachingProvider");
        CacheManager manager = provider.getCacheManager();
        
        // Ensure the cache exists with Redisson-specific configuration
        if (manager.getCache("rate-limit-buckets") == null) {
            manager.createCache("rate-limit-buckets", RedissonConfiguration.fromInstance(redissonClient));
        }
        
        return manager;
    }
}
