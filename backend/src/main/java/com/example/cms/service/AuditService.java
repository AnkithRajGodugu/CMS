package com.example.cms.service;

import com.example.cms.entity.AuditLog;
import com.example.cms.repository.AuditLogRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditService {
    
    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;
    
    /**
     * Log a user action asynchronously
     * 
     * @param userId The user ID performing the action
     * @param sectorId The sector ID (optional)
     * @param organizationId The organization ID (optional)
     * @param action The action being performed
     * @param resourceType The type of resource being acted upon
     * @param resourceId The ID of the resource
     * @param details Additional details as a map
     * @param ipAddress The IP address of the user
     */
    @Async
    @Transactional
    public void logAction(Long userId, Long sectorId, Long organizationId, 
                         String action, String resourceType, String resourceId,
                         Map<String, Object> details, String ipAddress) {
        try {
            String detailsJson = details != null ? objectMapper.writeValueAsString(details) : null;
            
            AuditLog auditLog = AuditLog.builder()
                    .userId(userId)
                    .sectorId(sectorId)
                    .organizationId(organizationId)
                    .action(action)
                    .resourceType(resourceType)
                    .resourceId(resourceId)
                    .details(detailsJson)
                    .ipAddress(ipAddress)
                    .timestamp(LocalDateTime.now())
                    .status("SUCCESS")
                    .build();
            
            auditLogRepository.save(auditLog);
            log.debug("Audit log created: action={}, userId={}, resourceType={}", 
                     action, userId, resourceType);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize audit log details", e);
        } catch (Exception e) {
            log.error("Failed to create audit log", e);
        }
    }
    
    /**
     * Log an authorization failure asynchronously
     * 
     * @param userId The user ID attempting the action
     * @param sectorId The sector ID (optional)
     * @param organizationId The organization ID (optional)
     * @param action The action that was attempted
     * @param resourceType The type of resource
     * @param resourceId The ID of the resource
     * @param reason The reason for the failure
     * @param ipAddress The IP address of the user
     */
    @Async
    @Transactional
    public void logAuthorizationFailure(Long userId, Long sectorId, Long organizationId,
                                       String action, String resourceType, String resourceId,
                                       String reason, String ipAddress) {
        try {
            Map<String, Object> details = new HashMap<>();
            details.put("reason", reason);
            details.put("attemptedAction", action);
            
            String detailsJson = objectMapper.writeValueAsString(details);
            
            AuditLog auditLog = AuditLog.builder()
                    .userId(userId)
                    .sectorId(sectorId)
                    .organizationId(organizationId)
                    .action("AUTHORIZATION_FAILURE")
                    .resourceType(resourceType)
                    .resourceId(resourceId)
                    .details(detailsJson)
                    .ipAddress(ipAddress)
                    .timestamp(LocalDateTime.now())
                    .status("FAILURE")
                    .errorMessage(reason)
                    .build();
            
            auditLogRepository.save(auditLog);
            log.warn("Authorization failure logged: userId={}, action={}, reason={}", 
                    userId, action, reason);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize authorization failure details", e);
        } catch (Exception e) {
            log.error("Failed to log authorization failure", e);
        }
    }
    
    /**
     * Log data access asynchronously
     * 
     * @param userId The user ID accessing the data
     * @param sectorId The sector ID
     * @param organizationId The organization ID (optional)
     * @param resourceType The type of resource being accessed
     * @param resourceId The ID of the resource
     * @param accessType The type of access (READ, WRITE, DELETE, etc.)
     * @param ipAddress The IP address of the user
     */
    @Async
    @Transactional
    public void logDataAccess(Long userId, Long sectorId, Long organizationId,
                             String resourceType, String resourceId, 
                             String accessType, String ipAddress) {
        try {
            Map<String, Object> details = new HashMap<>();
            details.put("accessType", accessType);
            details.put("timestamp", LocalDateTime.now().toString());
            
            String detailsJson = objectMapper.writeValueAsString(details);
            
            AuditLog auditLog = AuditLog.builder()
                    .userId(userId)
                    .sectorId(sectorId)
                    .organizationId(organizationId)
                    .action("DATA_ACCESS_" + accessType)
                    .resourceType(resourceType)
                    .resourceId(resourceId)
                    .details(detailsJson)
                    .ipAddress(ipAddress)
                    .timestamp(LocalDateTime.now())
                    .status("SUCCESS")
                    .build();
            
            auditLogRepository.save(auditLog);
            log.debug("Data access logged: userId={}, resourceType={}, accessType={}", 
                     userId, resourceType, accessType);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize data access details", e);
        } catch (Exception e) {
            log.error("Failed to log data access", e);
        }
    }
    
    /**
     * Log a failed operation asynchronously
     * 
     * @param userId The user ID
     * @param sectorId The sector ID (optional)
     * @param organizationId The organization ID (optional)
     * @param action The action that failed
     * @param resourceType The type of resource
     * @param resourceId The ID of the resource
     * @param errorMessage The error message
     * @param ipAddress The IP address of the user
     */
    @Async
    @Transactional
    public void logFailedOperation(Long userId, Long sectorId, Long organizationId,
                                  String action, String resourceType, String resourceId,
                                  String errorMessage, String ipAddress) {
        try {
            Map<String, Object> details = new HashMap<>();
            details.put("error", errorMessage);
            
            String detailsJson = objectMapper.writeValueAsString(details);
            
            AuditLog auditLog = AuditLog.builder()
                    .userId(userId)
                    .sectorId(sectorId)
                    .organizationId(organizationId)
                    .action(action)
                    .resourceType(resourceType)
                    .resourceId(resourceId)
                    .details(detailsJson)
                    .ipAddress(ipAddress)
                    .timestamp(LocalDateTime.now())
                    .status("FAILURE")
                    .errorMessage(errorMessage)
                    .build();
            
            auditLogRepository.save(auditLog);
            log.error("Failed operation logged: userId={}, action={}, error={}", 
                     userId, action, errorMessage);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize failed operation details", e);
        } catch (Exception e) {
            log.error("Failed to log failed operation", e);
        }
    }
    
    /**
     * Simplified method for logging actions without optional parameters
     */
    @Async
    @Transactional
    public void logAction(Long userId, String action, String resourceType, 
                         String resourceId, String ipAddress) {
        logAction(userId, null, null, action, resourceType, resourceId, null, ipAddress);
    }
    
    /**
     * Log authentication events
     */
    @Async
    @Transactional
    public void logAuthentication(Long userId, String action, boolean success, 
                                  String ipAddress, String details) {
        try {
            Map<String, Object> detailsMap = new HashMap<>();
            detailsMap.put("success", success);
            detailsMap.put("details", details);
            
            String detailsJson = objectMapper.writeValueAsString(detailsMap);
            
            AuditLog auditLog = AuditLog.builder()
                    .userId(userId)
                    .action(action)
                    .resourceType("AUTHENTICATION")
                    .details(detailsJson)
                    .ipAddress(ipAddress)
                    .timestamp(LocalDateTime.now())
                    .status(success ? "SUCCESS" : "FAILURE")
                    .errorMessage(success ? null : details)
                    .build();
            
            auditLogRepository.save(auditLog);
            log.info("Authentication event logged: userId={}, action={}, success={}", 
                    userId, action, success);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize authentication details", e);
        } catch (Exception e) {
            log.error("Failed to log authentication event", e);
        }
    }
}
