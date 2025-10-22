package com.example.cms.event;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Event model for audit logging.
 * This event is published to Kafka for audit trail purposes.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuditEvent {
    
    /**
     * Unique identifier for the audit event
     */
    private String id;
    
    /**
     * ID of the user who performed the action
     */
    private Long userId;
    
    /**
     * ID of the sector
     */
    private Long sectorId;
    
    /**
     * ID of the organization (if applicable)
     */
    private Long organizationId;
    
    /**
     * Action performed (e.g., LOGIN, CREATE, UPDATE, DELETE)
     */
    private String action;
    
    /**
     * Type of resource affected (e.g., USER, ACCOUNT, PATIENT)
     */
    private String resourceType;
    
    /**
     * ID of the resource affected
     */
    private String resourceId;
    
    /**
     * Additional details about the action
     */
    private String details;
    
    /**
     * IP address of the user
     */
    private String ipAddress;
    
    /**
     * Timestamp when the action occurred
     */
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;
}
