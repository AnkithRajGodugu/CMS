package com.example.cms.filter;

import com.example.cms.service.ErrorRateMonitoringService;
import com.example.cms.service.PerformanceMonitoringService;
import com.example.cms.util.LoggingUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

/**
 * Filter to add logging context (MDC) for each request.
 * Executes before other filters to ensure logging context is available.
 */
@Component
@Order(1)
@RequiredArgsConstructor
public class LoggingFilter extends OncePerRequestFilter {
    
    private static final Logger log = LoggerFactory.getLogger(LoggingFilter.class);
    
    private final PerformanceMonitoringService performanceMonitoringService;
    private final ErrorRateMonitoringService errorRateMonitoringService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            // Generate unique request ID
            String requestId = UUID.randomUUID().toString();
            LoggingUtil.setRequestId(requestId);
            
            // Add request ID to response header for tracing
            response.setHeader("X-Request-ID", requestId);
            
            // Get client IP address
            String ipAddress = getClientIpAddress(request);
            LoggingUtil.setIpAddress(ipAddress);
            
            // Log request
            long startTime = System.currentTimeMillis();
            log.info("Incoming request: {} {} from {}", 
                    request.getMethod(), 
                    request.getRequestURI(), 
                    ipAddress);
            
            try {
                filterChain.doFilter(request, response);
            } finally {
                // Log response and record performance metrics
                long duration = System.currentTimeMillis() - startTime;
                int status = response.getStatus();
                
                log.info("Completed request: {} {} - Status: {} - Duration: {}ms",
                        request.getMethod(),
                        request.getRequestURI(),
                        status,
                        duration);
                
                // Record metrics for API endpoints
                if (request.getRequestURI().startsWith("/api/")) {
                    // Record performance metrics
                    performanceMonitoringService.recordEndpointResponseTime(
                            request.getRequestURI(),
                            request.getMethod(),
                            duration
                    );
                    
                    // Record error rate metrics
                    if (status >= 400) {
                        String errorType = getErrorType(status);
                        errorRateMonitoringService.recordError(
                                request.getRequestURI(),
                                errorType,
                                "HTTP " + status
                        );
                    } else {
                        errorRateMonitoringService.recordSuccess(request.getRequestURI());
                    }
                }
            }
        } finally {
            // Clear MDC context after request
            LoggingUtil.clear();
        }
    }
    
    /**
     * Get client IP address from request, considering proxy headers
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String[] headerNames = {
            "X-Forwarded-For",
            "X-Real-IP",
            "Proxy-Client-IP",
            "WL-Proxy-Client-IP",
            "HTTP_X_FORWARDED_FOR",
            "HTTP_X_FORWARDED",
            "HTTP_X_CLUSTER_CLIENT_IP",
            "HTTP_CLIENT_IP",
            "HTTP_FORWARDED_FOR",
            "HTTP_FORWARDED",
            "HTTP_VIA",
            "REMOTE_ADDR"
        };
        
        for (String header : headerNames) {
            String ip = request.getHeader(header);
            if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
                // X-Forwarded-For can contain multiple IPs, take the first one
                if (ip.contains(",")) {
                    ip = ip.split(",")[0].trim();
                }
                return ip;
            }
        }
        
        return request.getRemoteAddr();
    }
    
    /**
     * Get error type based on HTTP status code
     */
    private String getErrorType(int status) {
        if (status >= 500) {
            return "SERVER_ERROR";
        } else if (status == 404) {
            return "NOT_FOUND";
        } else if (status == 403) {
            return "FORBIDDEN";
        } else if (status == 401) {
            return "UNAUTHORIZED";
        } else if (status == 400) {
            return "BAD_REQUEST";
        } else if (status >= 400) {
            return "CLIENT_ERROR";
        }
        return "UNKNOWN_ERROR";
    }
}
