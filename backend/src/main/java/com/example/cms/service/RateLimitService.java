package com.example.cms.service;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Simple in-memory rate limiter using bucket4j.
 * Resets cleanly on each application restart — suitable for development.
 * For production, swap the ConcurrentHashMap for a Redis-backed ProxyManager.
 */
@Service
public class RateLimitService {

    // ConcurrentHashMap — volatile in-memory only, resets on restart
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    /**
     * Resolve or create a rate-limit bucket for the given key (e.g. client IP).
     * Allows 50 attempts per 15 minutes with greedy refill.
     */
    public Bucket resolveBucket(String key) {
        return buckets.computeIfAbsent(key, k ->
                Bucket.builder()
                        .addLimit(Bandwidth.classic(50, Refill.greedy(50, Duration.ofMinutes(15))))
                        .build()
        );
    }

    public boolean tryConsume(String key) {
        return resolveBucket(key).tryConsume(1);
    }
}
