package com.example.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for field-specific validation errors.
 * Contains information about which field failed validation and why.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FieldError {
    
    /**
     * Name of the field that failed validation
     */
    private String field;
    
    /**
     * The rejected value (optional, may be null for security)
     */
    private Object rejectedValue;
    
    /**
     * User-friendly error message describing the validation failure
     */
    private String message;
}
