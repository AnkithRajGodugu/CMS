package com.example.cms.controller;

import com.example.cms.service.ErrorRateMonitoringService;
import com.example.cms.service.PerformanceMonitoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

/**
 * REST controller for exposing performance metrics.
 * Only accessible by administrators.
 */
@RestController
@RequestMapping("/api/metrics")
@RequiredArgsConstructor
public class MetricsController {
    
    private final PerformanceMonitoringService performanceMonitoringService;
    private final ErrorRateMonitoringService errorRateMonitoringService;
    
    /**
     * Get all endpoint performance metrics
     */
    @GetMapping("/endpoints")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getEndpointMetrics() {
        Map<String, PerformanceMonitoringService.EndpointMetrics> metrics = 
                performanceMonitoringService.getAllEndpointMetrics();
        
        Map<String, Object> response = new HashMap<>();
        Map<String, Map<String, Object>> formattedMetrics = new HashMap<>();
        
        metrics.forEach((endpoint, metric) -> {
            Map<String, Object> metricData = new HashMap<>();
            metricData.put("totalRequests", metric.getTotalRequests());
            metricData.put("averageDuration", metric.getAverageDuration());
            metricData.put("minDuration", metric.getMinDuration());
            metricData.put("maxDuration", metric.getMaxDuration());
            metricData.put("slowRequests", metric.getSlowRequests());
            metricData.put("slowRequestPercentage", String.format("%.2f%%", metric.getSlowRequestPercentage()));
            formattedMetrics.put(endpoint, metricData);
        });
        
        response.put("endpoints", formattedMetrics);
        response.put("totalEndpoints", metrics.size());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get metrics for a specific endpoint
     */
    @GetMapping("/endpoints/{method}/{path}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getEndpointMetric(
            @PathVariable String method,
            @PathVariable String path) {
        
        PerformanceMonitoringService.EndpointMetrics metric = 
                performanceMonitoringService.getEndpointMetrics("/" + path, method.toUpperCase());
        
        if (metric == null) {
            return ResponseEntity.notFound().build();
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("endpoint", method.toUpperCase() + " /" + path);
        response.put("totalRequests", metric.getTotalRequests());
        response.put("averageDuration", metric.getAverageDuration());
        response.put("minDuration", metric.getMinDuration());
        response.put("maxDuration", metric.getMaxDuration());
        response.put("slowRequests", metric.getSlowRequests());
        response.put("slowRequestPercentage", String.format("%.2f%%", metric.getSlowRequestPercentage()));
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get all database query metrics
     */
    @GetMapping("/queries")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getQueryMetrics() {
        Map<String, PerformanceMonitoringService.QueryMetrics> metrics = 
                performanceMonitoringService.getAllQueryMetrics();
        
        Map<String, Object> response = new HashMap<>();
        Map<String, Map<String, Object>> formattedMetrics = new HashMap<>();
        
        metrics.forEach((query, metric) -> {
            Map<String, Object> metricData = new HashMap<>();
            metricData.put("totalQueries", metric.getTotalQueries());
            metricData.put("averageDuration", metric.getAverageDuration());
            metricData.put("minDuration", metric.getMinDuration());
            metricData.put("maxDuration", metric.getMaxDuration());
            metricData.put("slowQueries", metric.getSlowQueries());
            metricData.put("slowQueryPercentage", String.format("%.2f%%", metric.getSlowQueryPercentage()));
            formattedMetrics.put(query, metricData);
        });
        
        response.put("queries", formattedMetrics);
        response.put("totalQueries", metrics.size());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get performance summary
     */
    @GetMapping("/summary")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getPerformanceSummary() {
        Map<String, PerformanceMonitoringService.EndpointMetrics> endpointMetrics = 
                performanceMonitoringService.getAllEndpointMetrics();
        Map<String, PerformanceMonitoringService.QueryMetrics> queryMetrics = 
                performanceMonitoringService.getAllQueryMetrics();
        
        long totalRequests = endpointMetrics.values().stream()
                .mapToLong(PerformanceMonitoringService.EndpointMetrics::getTotalRequests)
                .sum();
        
        long totalSlowRequests = endpointMetrics.values().stream()
                .mapToLong(PerformanceMonitoringService.EndpointMetrics::getSlowRequests)
                .sum();
        
        long totalQueries = queryMetrics.values().stream()
                .mapToLong(PerformanceMonitoringService.QueryMetrics::getTotalQueries)
                .sum();
        
        long totalSlowQueries = queryMetrics.values().stream()
                .mapToLong(PerformanceMonitoringService.QueryMetrics::getSlowQueries)
                .sum();
        
        Map<String, Object> response = new HashMap<>();
        response.put("totalEndpoints", endpointMetrics.size());
        response.put("totalRequests", totalRequests);
        response.put("totalSlowRequests", totalSlowRequests);
        response.put("slowRequestPercentage", totalRequests > 0 ? 
                String.format("%.2f%%", (totalSlowRequests * 100.0) / totalRequests) : "0.00%");
        
        response.put("totalQueryTypes", queryMetrics.size());
        response.put("totalQueries", totalQueries);
        response.put("totalSlowQueries", totalSlowQueries);
        response.put("slowQueryPercentage", totalQueries > 0 ? 
                String.format("%.2f%%", (totalSlowQueries * 100.0) / totalQueries) : "0.00%");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Reset all performance metrics
     */
    @PostMapping("/reset")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> resetMetrics() {
        performanceMonitoringService.resetMetrics();
        errorRateMonitoringService.resetMetrics();
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "All metrics reset successfully");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get error rate statistics
     */
    @GetMapping("/errors")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getErrorStatistics() {
        Map<String, Object> response = new HashMap<>();
        
        // Overall statistics
        response.put("overall", errorRateMonitoringService.getTotalStatistics());
        
        // Error counts by type
        response.put("errorsByType", errorRateMonitoringService.getErrorCountsByType());
        
        // Endpoint errors
        Map<String, ErrorRateMonitoringService.ErrorMetrics> endpointErrors = 
                errorRateMonitoringService.getAllEndpointErrors();
        
        Map<String, Map<String, Object>> formattedEndpointErrors = new HashMap<>();
        endpointErrors.forEach((endpoint, metrics) -> {
            Map<String, Object> metricData = new HashMap<>();
            metricData.put("totalRequests", metrics.getTotalRequests());
            metricData.put("successCount", metrics.getSuccessCount());
            metricData.put("errorCount", metrics.getErrorCount());
            metricData.put("errorRate", String.format("%.2f%%", metrics.getErrorRate()));
            formattedEndpointErrors.put(endpoint, metricData);
        });
        
        response.put("endpointErrors", formattedEndpointErrors);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get error rate for a specific endpoint
     */
    @GetMapping("/errors/endpoint")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getEndpointErrorRate(@RequestParam String endpoint) {
        double errorRate = errorRateMonitoringService.getEndpointErrorRate(endpoint);
        
        Map<String, Object> response = new HashMap<>();
        response.put("endpoint", endpoint);
        response.put("errorRate", String.format("%.2f%%", errorRate));
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get daily error summary
     */
    @GetMapping("/errors/daily/{date}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDailySummary(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        ErrorRateMonitoringService.DailySummary summary = 
                errorRateMonitoringService.getDailySummary(date);
        
        if (summary == null) {
            return ResponseEntity.notFound().build();
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("date", summary.date.toString());
        response.put("totalRequests", summary.totalRequests);
        response.put("totalErrors", summary.totalErrors);
        response.put("errorRate", String.format("%.2f%%", summary.errorRate));
        
        // Top error endpoints
        Map<String, Map<String, Object>> topEndpoints = new HashMap<>();
        summary.endpointErrors.entrySet().stream()
                .filter(e -> e.getValue().getErrorCount() > 0)
                .sorted((e1, e2) -> Long.compare(
                        e2.getValue().getErrorCount(), 
                        e1.getValue().getErrorCount()))
                .limit(10)
                .forEach(e -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("errorCount", e.getValue().getErrorCount());
                    data.put("errorRate", String.format("%.2f%%", e.getValue().getErrorRate()));
                    topEndpoints.put(e.getKey(), data);
                });
        response.put("topErrorEndpoints", topEndpoints);
        
        // Error types
        Map<String, Long> errorTypes = new HashMap<>();
        summary.errorTypeCount.forEach((type, count) -> errorTypes.put(type, count.get()));
        response.put("errorTypes", errorTypes);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get all daily summaries
     */
    @GetMapping("/errors/daily")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAllDailySummaries() {
        Map<LocalDate, ErrorRateMonitoringService.DailySummary> summaries = 
                errorRateMonitoringService.getAllDailySummaries();
        
        Map<String, Object> response = new HashMap<>();
        Map<String, Map<String, Object>> formattedSummaries = new HashMap<>();
        
        summaries.forEach((date, summary) -> {
            Map<String, Object> summaryData = new HashMap<>();
            summaryData.put("totalRequests", summary.totalRequests);
            summaryData.put("totalErrors", summary.totalErrors);
            summaryData.put("errorRate", String.format("%.2f%%", summary.errorRate));
            formattedSummaries.put(date.toString(), summaryData);
        });
        
        response.put("summaries", formattedSummaries);
        response.put("totalDays", summaries.size());
        
        return ResponseEntity.ok(response);
    }
}
