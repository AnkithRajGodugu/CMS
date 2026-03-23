package com.example.cms.service;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.BucketConfiguration;
import io.github.bucket4j.Refill;
import io.github.bucket4j.distributed.proxy.ProxyManager;
import io.github.bucket4j.grid.jcache.JCacheProxyManager;
import org.springframework.stereotype.Service;
import javax.cache.CacheManager;
import java.time.Duration;
import java.util.function.Supplier;

import org.springframework.beans.factory.annotation.Qualifier;

@Service
public class RateLimitService {

    private final CacheManager cacheManager;
    private final ProxyManager<String> proxyManager;

    public RateLimitService(@Qualifier("jCacheManager") CacheManager cacheManager) {
        this.cacheManager = cacheManager;
        this.proxyManager = new JCacheProxyManager<>(cacheManager.getCache("rate-limit-buckets"));
    }

    public Bucket resolveBucket(String key) {
        Supplier<BucketConfiguration> configSupplier = () -> BucketConfiguration.builder()
                .addLimit(Bandwidth.classic(5, Refill.greedy(5, Duration.ofMinutes(15))))
                .build();
        return proxyManager.builder().build(key, configSupplier);
    }

    public boolean tryConsume(String key) {
        return resolveBucket(key).tryConsume(1);
    }
}
