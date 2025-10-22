package com.example.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Error response DTO for validation errors.
 * Used when request validation fails.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ValidationErrorResponse {
    
    /**
     * HTTP status code (typically 400)
     */
    private int status;
    
    /**
     * General error message
     */
    private String message;
    
    /**
     * List of field-specific validation errors
     */
    private List<FieldError> errors;
    
    /**
     * Timestamp when the error occurred
     */
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
    
    /**
     * Optional path where the error occurred
     */
    private String path;
}
