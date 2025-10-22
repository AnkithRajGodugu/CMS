package com.example.cms.security;

import com.example.cms.exception.SectorNotAssignedException;
import com.example.cms.model.SectorContext;
import com.example.cms.service.SectorDetectionService;
import com.example.cms.util.LoggingUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Filter that enforces sector-based authorization for API requests.
 * Validates that users can only access their assigned sector's endpoints.
 */
@Component
@RequiredArgsConstructor
@Slf4j
@Order(2)
public class SectorAuthorizationFilter extends OncePerRequestFilter {
    
    private final SectorDetectionService sectorDetectionService;
    private final ObjectMapper objectMapper;
    private final com.example.cms.service.AuditService auditService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        
        String requestPath = request.getRequestURI();
        log.debug("Processing request: {} {}", request.getMethod(), requestPath);
        
        // Check if this is a sector-specific API request
        if (requestPath.startsWith("/api/sectors/")) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            // Skip filter if user is not authenticated
            if (authentication == null || !authentication.isAuthenticated() || 
                "anonymousUser".equals(authentication.getPrincipal())) {
                log.debug("Skipping sector authorization - user not authenticated");
                filterChain.doFilter(request, response);
                return;
            }
            
            try {
                // Detect user's sector
                SectorContext sectorContext = sectorDetectionService.detectSector(authentication);
                
                // Add sector context to MDC for logging
                LoggingUtil.setUserId(sectorContext.getUserId());
                LoggingUtil.setSectorId(sectorContext.getSectorId());
                LoggingUtil.setOrganizationId(sectorContext.getOrganizationId());
                
                // Extract requested sector from path (e.g., /api/sectors/banking/... -> banking)
                String requestedSector = extractSectorFromPath(requestPath);
                
                // Validate sector access
                if (requestedSector != null && !sectorContext.getSectorCode().equalsIgnoreCase(requestedSector)) {
                    log.warn("Unauthorized sector access attempt: User {} (sector: {}) tried to access {}",
                            authentication.getName(), sectorContext.getSectorCode(), requestedSector);
                    
                    // Log authorization failure
                    auditService.logAuthorizationFailure(
                            sectorContext.getUserId(),
                            sectorContext.getSectorId(),
                            sectorContext.getOrganizationId(),
                            "SECTOR_ACCESS",
                            "SECTOR",
                            requestedSector,
                            "User attempted to access unauthorized sector: " + requestedSector,
                            request.getRemoteAddr()
                    );
                    
                    sendForbiddenResponse(response, 
                            "Access denied. You are not authorized to access this sector.",
                            requestedSector,
                            sectorContext.getSectorCode());
                    return;
                }
                
                // Add sector context to request attributes for downstream use
                request.setAttribute("sectorContext", sectorContext);
                log.debug("Sector authorization successful for user {} accessing sector {}",
                        authentication.getName(), sectorContext.getSectorCode());
                
            } catch (SectorNotAssignedException e) {
                log.error("Sector not assigned for user: {}", authentication.getName());
                sendForbiddenResponse(response, 
                        "No sector assigned. Please contact administrator.",
                        null,
                        null);
                return;
            } catch (Exception e) {
                log.error("Error during sector authorization", e);
                sendErrorResponse(response, "An error occurred during authorization");
                return;
            }
        }
        
        // Continue with the filter chain
        filterChain.doFilter(request, response);
    }
    
    /**
     * Extracts the sector code from the request path.
     * Example: /api/sectors/banking/accounts -> "banking"
     *
     * @param requestPath The request URI path
     * @return The sector code, or null if not found
     */
    private String extractSectorFromPath(String requestPath) {
        String[] pathParts = requestPath.split("/");
        
        // Expected format: /api/sectors/{sectorCode}/...
        if (pathParts.length >= 4 && "api".equals(pathParts[1]) && "sectors".equals(pathParts[2])) {
            return pathParts[3];
        }
        
        return null;
    }
    
    /**
     * Sends a 403 Forbidden response with error details.
     */
    private void sendForbiddenResponse(HttpServletResponse response, 
                                       String message,
                                       String requestedSector,
                                       String userSector) throws IOException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", 403);
        errorResponse.put("error", "Forbidden");
        errorResponse.put("message", message);
        errorResponse.put("timestamp", LocalDateTime.now().toString());
        
        if (requestedSector != null) {
            errorResponse.put("requestedSector", requestedSector);
        }
        if (userSector != null) {
            errorResponse.put("userSector", userSector);
        }
        
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
    
    /**
     * Sends a 500 Internal Server Error response.
     */
    private void sendErrorResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        response.setContentType("application/json");
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("status", 500);
        errorResponse.put("error", "Internal Server Error");
        errorResponse.put("message", message);
        errorResponse.put("timestamp", LocalDateTime.now().toString());
        
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}
