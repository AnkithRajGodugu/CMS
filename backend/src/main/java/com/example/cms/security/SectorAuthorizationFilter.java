package com.example.cms.security;

import com.example.cms.exception.SectorNotAssignedException;
import com.example.cms.model.SectorContext;
import com.example.cms.service.SectorDetectionService;
import com.example.cms.service.AuditService;
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

@Component
@RequiredArgsConstructor
@Slf4j
@Order(2)
public class SectorAuthorizationFilter extends OncePerRequestFilter {

    private final SectorDetectionService sectorDetectionService;
    private final ObjectMapper objectMapper;
    private final AuditService auditService;

    @Override
    protected void doFilterInternal(

            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String requestPath = request.getRequestURI();
        System.out.println("🔥 SectorFilter HIT for path: " + requestPath);
        log.debug("SectorAuthorizationFilter processing: {}", requestPath);

        // Apply ONLY to sector-scoped APIs
        if (!requestPath.startsWith("/api/v1/sectors/")) {
            filterChain.doFilter(request, response);
            return;
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Skip if not authenticated
        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // 1️⃣ Detect sector context
            SectorContext sectorContext = sectorDetectionService.detectSector(authentication);

            System.out.println("🔥 SectorContext created:");
            System.out.println("UserId: " + sectorContext.getUserId());
            System.out.println("SectorCode: " + sectorContext.getSectorCode());
            System.out.println("Roles: " + sectorContext.getRoles());

            // 2️⃣ Put into logging MDC
            LoggingUtil.setUserId(sectorContext.getUserId());
            LoggingUtil.setSectorId(sectorContext.getSectorId());
            LoggingUtil.setOrganizationId(sectorContext.getOrganizationId());

            // 3️⃣ ✅ ADMIN BYPASS — EXACT PLACE
            if (sectorContext.getRoles() != null
                    && sectorContext.getRoles().contains("ROLE_ADMIN")) {

                System.out.println("🔥 Checking admin bypass. Roles = " + sectorContext.getRoles());

                log.debug("ADMIN user detected, bypassing sector validation");
                request.setAttribute("sectorContext", sectorContext);
                filterChain.doFilter(request, response);
                return;
            }

            // 4️⃣ Extract sector from URL: /api/sectors/{sector}/...
            String requestedSector = extractSectorFromPath(requestPath);

            // 5️⃣ Validate sector access
            if (requestedSector != null
                    && !sectorContext.getSectorCode().equalsIgnoreCase(requestedSector)) {

                log.warn(
                        "Unauthorized sector access: user={}, userSector={}, requestedSector={}",
                        authentication.getName(),
                        sectorContext.getSectorCode(),
                        requestedSector
                );

                auditService.logAuthorizationFailure(
                        sectorContext.getUserId(),
                        sectorContext.getSectorId(),
                        sectorContext.getOrganizationId(),
                        "SECTOR_ACCESS",
                        "SECTOR",
                        requestedSector,
                        "Unauthorized sector access attempt",
                        request.getRemoteAddr()
                );

                sendForbiddenResponse(
                        response,
                        "Access denied for sector: " + requestedSector,
                        requestedSector,
                        sectorContext.getSectorCode()
                );
                return;
            }

            // 6️⃣ Attach context for controllers/services
            request.setAttribute("sectorContext", sectorContext);

            filterChain.doFilter(request, response);

        } catch (SectorNotAssignedException e) {
            sendForbiddenResponse(
                    response,
                    "No sector assigned to user",
                    null,
                    null
            );
        } catch (Exception e) {
            log.error("Sector authorization error", e);
            sendErrorResponse(response, "Sector authorization failed");
        }

    }

    // ===================== helpers =====================

    private String extractSectorFromPath(String requestPath) {
        // /api/sectors/{sector}/...
        String[] parts = requestPath.split("/");
        if (parts.length >= 4
                && "api".equals(parts[1])
                && "sectors".equals(parts[2])) {
            return parts[3].toUpperCase();
        }
        return null;
    }

    private void sendForbiddenResponse(
            HttpServletResponse response,
            String message,
            String requestedSector,
            String userSector
    ) throws IOException {

        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");

        Map<String, Object> body = new HashMap<>();
        body.put("status", 403);
        body.put("error", "Forbidden");
        body.put("message", message);
        body.put("requestedSector", requestedSector);
        body.put("userSector", userSector);
        body.put("timestamp", LocalDateTime.now().toString());

        response.getWriter().write(objectMapper.writeValueAsString(body));
    }

    private void sendErrorResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        response.setContentType("application/json");

        Map<String, Object> body = new HashMap<>();
        body.put("status", 500);
        body.put("error", "Internal Server Error");
        body.put("message", message);
        body.put("timestamp", LocalDateTime.now().toString());

        response.getWriter().write(objectMapper.writeValueAsString(body));
    }
}
