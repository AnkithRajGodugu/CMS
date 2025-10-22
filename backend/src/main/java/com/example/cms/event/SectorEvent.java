package com.example.cms.event;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Event model for sector-specific operations.
 * This event is published to Kafka when sector-related actions occur.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SectorEvent {
    
    /**
     * Unique identifier for the event
     */
    private String eventId;
    
    /**
     * Type of event (e.g., ACCOUNT_CREATED, TRANSACTION_PROCESSED, PATIENT_REGISTERED)
     */
    private String eventType;
    
    /**
     * Sector code (e.g., BANKING, HEALTHCARE, EDUCATION)
     */
    private String sectorCode;
    
    /**
     * ID of the user who triggered the event
     */
    private Long userId;
    
    /**
     * ID of the organization (if applicable)
     */
    private Long organizationId;
    
    /**
     * Timestamp when the event occurred
     */
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;
    
    /**
     * Event payload containing sector-specific data
     */
    private Map<String, Object> payload;
    
    /**
     * Additional metadata about the event
     */
    private Map<String, String> metadata;
}
