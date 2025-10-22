package com.example.cms.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Service for monitoring error rates and triggering alerts.
 * Tracks errors by type, endpoint, and time period.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class ErrorRateMonitoringService {
    
    // Error rate threshold (5% of total requests)
    private static final double ERROR_RATE_THRESHOLD = 5.0;
    
    // Minimum requests before checking error rate
    private static final long MIN_REQUESTS_FOR_ALERT = 100;
    
    // Error tracking
    private final Map<String, ErrorMetrics> endpointErrors = new ConcurrentHashMap<>();
    private final Map<String, AtomicLong> errorTypeCount = new ConcurrentHashMap<>();
    private final AtomicLong totalRequests = new AtomicLong(0);
    private final AtomicLong totalErrors = new AtomicLong(0);
    
    // Daily summary tracking
    private LocalDate lastSummaryDate = LocalDate.now();
    private final Map<LocalDate, DailySummary> dailySummaries = new ConcurrentHashMap<>();
    
    /**
     * Record a successful request
     */
    public void recordSuccess(String endpoint) {
        totalRequests.incrementAndGet();
        endpointErrors.computeIfAbsent(endpoint, k -> new ErrorMetrics())
                .recordSuccess();
    }
    
    /**
     * Record an error
     */
    public void recordError(String endpoint, String errorType, String errorMessage) {
        totalRequests.incrementAndGet();
        totalErrors.incrementAndGet();
        
        endpointErrors.computeIfAbsent(endpoint, k -> new ErrorMetrics())
                .recordError();
        
        errorTypeCount.computeIfAbsent(errorType, k -> new AtomicLong(0))
                .incrementAndGet();
        
        log.error("Error recorded - Endpoint: {}, Type: {}, Message: {}", 
                endpoint, errorType, errorMessage);
        
        // Check if error rate exceeds threshold
        checkErrorRateThreshold();
    }
    
    /**
     * Check if error rate exceeds threshold and trigger alert
     */
    private void checkErrorRateThreshold() {
        long requests = totalRequests.get();
        long errors = totalErrors.get();
        
        if (requests >= MIN_REQUESTS_FOR_ALERT) {
            double errorRate = (errors * 100.0) / requests;
            
            if (errorRate > ERROR_RATE_THRESHOLD) {
                triggerAlert(errorRate, requests, errors);
            }
        }
    }
    
    /**
     * Trigger alert for high error rate
     */
    private void triggerAlert(double errorRate, long totalRequests, long totalErrors) {
        log.error("HIGH ERROR RATE ALERT: Error rate is {:.2f}% ({} errors out of {} requests)",
                errorRate, totalErrors, totalRequests);
        
        // In production, this would send alerts via email, Slack, PagerDuty, etc.
        // For now, we just log it
    }
    
    /**
     * Get error rate for a specific endpoint
     */
    public double getEndpointErrorRate(String endpoint) {
        ErrorMetrics metrics = endpointErrors.get(endpoint);
        if (metrics == null) {
            return 0.0;
        }
        return metrics.getErrorRate();
    }
    
    /**
     * Get overall error rate
     */
    public double getOverallErrorRate() {
        long requests = totalRequests.get();
        long errors = totalErrors.get();
        return requests > 0 ? (errors * 100.0) / requests : 0.0;
    }
    
    /**
     * Get all endpoint error metrics
     */
    public Map<String, ErrorMetrics> getAllEndpointErrors() {
        return new ConcurrentHashMap<>(endpointErrors);
    }
    
    /**
     * Get error counts by type
     */
    public Map<String, Long> getErrorCountsByType() {
        Map<String, Long> result = new ConcurrentHashMap<>();
        errorTypeCount.forEach((type, count) -> result.put(type, count.get()));
        return result;
    }
    
    /**
     * Get total statistics
     */
    public Map<String, Object> getTotalStatistics() {
        Map<String, Object> stats = new ConcurrentHashMap<>();
        stats.put("totalRequests", totalRequests.get());
        stats.put("totalErrors", totalErrors.get());
        stats.put("errorRate", String.format("%.2f%%", getOverallErrorRate()));
        stats.put("uniqueEndpoints", endpointErrors.size());
        stats.put("errorTypes", errorTypeCount.size());
        return stats;
    }
    
    /**
     * Reset all metrics
     */
    public void resetMetrics() {
        endpointErrors.clear();
        errorTypeCount.clear();
        totalRequests.set(0);
        totalErrors.set(0);
        log.info("Error rate metrics reset");
    }
    
    /**
     * Generate daily error summary report
     * Runs at midnight every day
     */
    @Scheduled(cron = "0 0 0 * * *")
    public void generateDailySummary() {
        LocalDate today = LocalDate.now();
        
        // Skip if already generated for today
        if (today.equals(lastSummaryDate)) {
            return;
        }
        
        DailySummary summary = new DailySummary(
                lastSummaryDate,
                totalRequests.get(),
                totalErrors.get(),
                getOverallErrorRate(),
                new ConcurrentHashMap<>(endpointErrors),
                new ConcurrentHashMap<>(errorTypeCount)
        );
        
        dailySummaries.put(lastSummaryDate, summary);
        
        log.info("Daily Error Summary for {}: Total Requests: {}, Total Errors: {}, Error Rate: {:.2f}%",
                lastSummaryDate,
                summary.totalRequests,
                summary.totalErrors,
                summary.errorRate);
        
        // Log top error endpoints
        endpointErrors.entrySet().stream()
                .filter(e -> e.getValue().getErrorCount() > 0)
                .sorted((e1, e2) -> Long.compare(e2.getValue().getErrorCount(), e1.getValue().getErrorCount()))
                .limit(10)
                .forEach(e -> log.info("  - {}: {} errors ({:.2f}%)",
                        e.getKey(),
                        e.getValue().getErrorCount(),
                        e.getValue().getErrorRate()));
        
        // Log top error types
        errorTypeCount.entrySet().stream()
                .sorted((e1, e2) -> Long.compare(e2.getValue().get(), e1.getValue().get()))
                .limit(10)
                .forEach(e -> log.info("  - {}: {} occurrences", e.getKey(), e.getValue().get()));
        
        // Reset for new day
        lastSummaryDate = today;
        resetMetrics();
    }
    
    /**
     * Get daily summary for a specific date
     */
    public DailySummary getDailySummary(LocalDate date) {
        return dailySummaries.get(date);
    }
    
    /**
     * Get all daily summaries
     */
    public Map<LocalDate, DailySummary> getAllDailySummaries() {
        return new ConcurrentHashMap<>(dailySummaries);
    }
    
    /**
     * Metrics for tracking errors per endpoint
     */
    public static class ErrorMetrics {
        private final AtomicLong successCount = new AtomicLong(0);
        private final AtomicLong errorCount = new AtomicLong(0);
        
        public void recordSuccess() {
            successCount.incrementAndGet();
        }
        
        public void recordError() {
            errorCount.incrementAndGet();
        }
        
        public long getSuccessCount() {
            return successCount.get();
        }
        
        public long getErrorCount() {
            return errorCount.get();
        }
        
        public long getTotalRequests() {
            return successCount.get() + errorCount.get();
        }
        
        public double getErrorRate() {
            long total = getTotalRequests();
            return total > 0 ? (errorCount.get() * 100.0) / total : 0.0;
        }
    }
    
    /**
     * Daily summary record
     */
    public static class DailySummary {
        public final LocalDate date;
        public final long totalRequests;
        public final long totalErrors;
        public final double errorRate;
        public final Map<String, ErrorMetrics> endpointErrors;
        public final Map<String, AtomicLong> errorTypeCount;
        
        public DailySummary(LocalDate date, long totalRequests, long totalErrors, 
                           double errorRate, Map<String, ErrorMetrics> endpointErrors,
                           Map<String, AtomicLong> errorTypeCount) {
            this.date = date;
            this.totalRequests = totalRequests;
            this.totalErrors = totalErrors;
            this.errorRate = errorRate;
            this.endpointErrors = endpointErrors;
            this.errorTypeCount = errorTypeCount;
        }
    }
}
