package com.example.cms.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Service for monitoring application performance metrics.
 * Tracks API response times, slow queries, and other performance indicators.
 */
@Service
@Slf4j
public class PerformanceMonitoringService {
    
    // Threshold for slow API requests (in milliseconds)
    private static final long SLOW_REQUEST_THRESHOLD = 2000;
    
    // Threshold for slow database queries (in milliseconds)
    private static final long SLOW_QUERY_THRESHOLD = 2000;
    
    // Metrics storage
    private final Map<String, EndpointMetrics> endpointMetrics = new ConcurrentHashMap<>();
    private final Map<String, QueryMetrics> queryMetrics = new ConcurrentHashMap<>();
    
    /**
     * Record API endpoint response time
     */
    public void recordEndpointResponseTime(String endpoint, String method, long durationMs) {
        String key = method + " " + endpoint;
        
        endpointMetrics.computeIfAbsent(key, k -> new EndpointMetrics())
                .recordRequest(durationMs);
        
        if (durationMs > SLOW_REQUEST_THRESHOLD) {
            log.warn("Slow API request detected: {} - Duration: {}ms", key, durationMs);
        }
    }
    
    /**
     * Record database query execution time
     */
    public void recordQueryExecutionTime(String queryName, long durationMs) {
        queryMetrics.computeIfAbsent(queryName, k -> new QueryMetrics())
                .recordQuery(durationMs);
        
        if (durationMs > SLOW_QUERY_THRESHOLD) {
            log.warn("Slow database query detected: {} - Duration: {}ms", queryName, durationMs);
        }
    }
    
    /**
     * Get metrics for a specific endpoint
     */
    public EndpointMetrics getEndpointMetrics(String endpoint, String method) {
        String key = method + " " + endpoint;
        return endpointMetrics.get(key);
    }
    
    /**
     * Get all endpoint metrics
     */
    public Map<String, EndpointMetrics> getAllEndpointMetrics() {
        return new ConcurrentHashMap<>(endpointMetrics);
    }
    
    /**
     * Get metrics for a specific query
     */
    public QueryMetrics getQueryMetrics(String queryName) {
        return queryMetrics.get(queryName);
    }
    
    /**
     * Get all query metrics
     */
    public Map<String, QueryMetrics> getAllQueryMetrics() {
        return new ConcurrentHashMap<>(queryMetrics);
    }
    
    /**
     * Reset all metrics
     */
    public void resetMetrics() {
        endpointMetrics.clear();
        queryMetrics.clear();
        log.info("Performance metrics reset");
    }
    
    /**
     * Metrics for API endpoints
     */
    public static class EndpointMetrics {
        private final AtomicLong totalRequests = new AtomicLong(0);
        private final AtomicLong totalDuration = new AtomicLong(0);
        private final AtomicLong minDuration = new AtomicLong(Long.MAX_VALUE);
        private final AtomicLong maxDuration = new AtomicLong(0);
        private final AtomicLong slowRequests = new AtomicLong(0);
        
        public void recordRequest(long durationMs) {
            totalRequests.incrementAndGet();
            totalDuration.addAndGet(durationMs);
            
            // Update min duration
            long currentMin = minDuration.get();
            while (durationMs < currentMin && !minDuration.compareAndSet(currentMin, durationMs)) {
                currentMin = minDuration.get();
            }
            
            // Update max duration
            long currentMax = maxDuration.get();
            while (durationMs > currentMax && !maxDuration.compareAndSet(currentMax, durationMs)) {
                currentMax = maxDuration.get();
            }
            
            if (durationMs > SLOW_REQUEST_THRESHOLD) {
                slowRequests.incrementAndGet();
            }
        }
        
        public long getTotalRequests() {
            return totalRequests.get();
        }
        
        public long getAverageDuration() {
            long total = totalRequests.get();
            return total > 0 ? totalDuration.get() / total : 0;
        }
        
        public long getMinDuration() {
            long min = minDuration.get();
            return min == Long.MAX_VALUE ? 0 : min;
        }
        
        public long getMaxDuration() {
            return maxDuration.get();
        }
        
        public long getSlowRequests() {
            return slowRequests.get();
        }
        
        public double getSlowRequestPercentage() {
            long total = totalRequests.get();
            return total > 0 ? (slowRequests.get() * 100.0) / total : 0.0;
        }
    }
    
    /**
     * Metrics for database queries
     */
    public static class QueryMetrics {
        private final AtomicLong totalQueries = new AtomicLong(0);
        private final AtomicLong totalDuration = new AtomicLong(0);
        private final AtomicLong minDuration = new AtomicLong(Long.MAX_VALUE);
        private final AtomicLong maxDuration = new AtomicLong(0);
        private final AtomicLong slowQueries = new AtomicLong(0);
        
        public void recordQuery(long durationMs) {
            totalQueries.incrementAndGet();
            totalDuration.addAndGet(durationMs);
            
            // Update min duration
            long currentMin = minDuration.get();
            while (durationMs < currentMin && !minDuration.compareAndSet(currentMin, durationMs)) {
                currentMin = minDuration.get();
            }
            
            // Update max duration
            long currentMax = maxDuration.get();
            while (durationMs > currentMax && !maxDuration.compareAndSet(currentMax, durationMs)) {
                currentMax = maxDuration.get();
            }
            
            if (durationMs > SLOW_QUERY_THRESHOLD) {
                slowQueries.incrementAndGet();
            }
        }
        
        public long getTotalQueries() {
            return totalQueries.get();
        }
        
        public long getAverageDuration() {
            long total = totalQueries.get();
            return total > 0 ? totalDuration.get() / total : 0;
        }
        
        public long getMinDuration() {
            long min = minDuration.get();
            return min == Long.MAX_VALUE ? 0 : min;
        }
        
        public long getMaxDuration() {
            return maxDuration.get();
        }
        
        public long getSlowQueries() {
            return slowQueries.get();
        }
        
        public double getSlowQueryPercentage() {
            long total = totalQueries.get();
            return total > 0 ? (slowQueries.get() * 100.0) / total : 0.0;
        }
    }
}
