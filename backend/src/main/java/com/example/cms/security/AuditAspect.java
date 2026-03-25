package com.example.cms.security;

import com.example.cms.service.AuditService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.HashMap;
import java.util.Map;

/**
 * AuditAspect intercepts all POST/PUT/DELETE controller methods and records
 * them asynchronously to the audit_log table.
 *
 * Coverage: any method in a class annotated with @RestController that is
 * also annotated with @PostMapping, @PutMapping, or @DeleteMapping.
 */
@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class AuditAspect {

    private final AuditService auditService;

    /**
     * Intercept all write-operation REST endpoints.
     * Pointcut matches @PostMapping, @PutMapping, @DeleteMapping on @RestController beans.
     */
    @Around("within(@org.springframework.web.bind.annotation.RestController *) && " +
            "(@annotation(org.springframework.web.bind.annotation.PostMapping) || " +
            " @annotation(org.springframework.web.bind.annotation.PutMapping)  || " +
            " @annotation(org.springframework.web.bind.annotation.DeleteMapping))")
    public Object auditWriteOperation(ProceedingJoinPoint joinPoint) throws Throwable {
        Object result = null;
        String status = "SUCCESS";
        String errorMessage = null;

        long start = System.currentTimeMillis();

        try {
            result = joinPoint.proceed();
            return result;
        } catch (Exception e) {
            status = "FAILURE";
            errorMessage = e.getMessage();
            throw e;
        } finally {
            try {
                logAuditEntry(joinPoint, status, errorMessage, System.currentTimeMillis() - start);
            } catch (Exception loggingEx) {
                // Never let audit logging break the actual operation
                log.error("AuditAspect: Failed to record audit log", loggingEx);
            }
        }
    }

    private void logAuditEntry(ProceedingJoinPoint joinPoint, String status, String errorMessage, long durationMs) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser"))
                ? auth.getName() : "anonymous";

        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String action = deriveAction(methodName, className);
        String resourceType = deriveResourceType(className);

        String ip = extractIp();

        Map<String, Object> details = new HashMap<>();
        details.put("method", methodName);
        details.put("controller", className);
        details.put("durationMs", durationMs);
        if (errorMessage != null) {
            details.put("error", errorMessage);
        }

        // Async — non-blocking
        auditService.logAction(
                null, // userId resolved inside service from username if needed
                null,
                null,
                action,
                resourceType,
                username, // use username as resourceId proxy for now
                details,
                ip
        );
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private String deriveAction(String methodName, String controllerName) {
        String method = methodName.toLowerCase();
        if (method.startsWith("create") || method.startsWith("register") || method.startsWith("add"))
            return "CREATE";
        if (method.startsWith("update") || method.startsWith("edit") || method.startsWith("modify"))
            return "UPDATE";
        if (method.startsWith("delete") || method.startsWith("remove"))
            return "DELETE";
        if (method.startsWith("do") || method.startsWith("transfer"))
            return "EXECUTE";
        return methodName.toUpperCase();
    }

    private String deriveResourceType(String controllerName) {
        return controllerName.replace("Controller", "").toUpperCase();
    }

    private String extractIp() {
        try {
            ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs == null) return "unknown";
            HttpServletRequest request = attrs.getRequest();
            String forwarded = request.getHeader("X-Forwarded-For");
            if (forwarded != null && !forwarded.isBlank()) return forwarded.split(",")[0].trim();
            return request.getRemoteAddr();
        } catch (Exception e) {
            return "unknown";
        }
    }
}
