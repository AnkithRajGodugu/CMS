package com.example.cms.exception;

import com.example.cms.dto.FieldError;
import com.example.cms.dto.ValidationErrorResponse;
import com.example.cms.model.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.KafkaException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Global exception handler for the CMS application.
 * Provides consistent error responses and ensures system internals are not exposed.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Handle sector not assigned exceptions.
     * Returns 400 Bad Request when user has no sector assigned.
     */
    @ExceptionHandler(SectorNotAssignedException.class)
    public ResponseEntity<ErrorResponse> handleSectorNotAssigned(
            SectorNotAssignedException ex, 
            HttpServletRequest request) {
        
        logger.warn("Sector not assigned: {} - Path: {}", ex.getMessage(), request.getRequestURI());
        
        ErrorResponse error = ErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message("No sector has been assigned to your account. Please contact your administrator.")
                .timestamp(LocalDateTime.now())
                .path(request.getRequestURI())
                .build();
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * Handle unauthorized sector access exceptions.
     * Returns 403 Forbidden when user attempts to access unauthorized sector.
     */
    @ExceptionHandler(UnauthorizedSectorAccessException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorizedSectorAccess(
            UnauthorizedSectorAccessException ex, 
            HttpServletRequest request) {
        
        logger.warn("Unauthorized sector access attempt: {} - Path: {}", ex.getMessage(), request.getRequestURI());
        
        ErrorResponse error = ErrorResponse.builder()
                .status(HttpStatus.FORBIDDEN.value())
                .message("You do not have access to this sector.")
                .timestamp(LocalDateTime.now())
                .path(request.getRequestURI())
                .build();
        
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }

    /**
     * Handle sector not found exceptions.
     * Returns 404 Not Found when requested sector doesn't exist.
     */
    @ExceptionHandler(SectorNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleSectorNotFound(
            SectorNotFoundException ex, 
            HttpServletRequest request) {
        
        logger.warn("Sector not found: {} - Path: {}", ex.getMessage(), request.getRequestURI());
        
        ErrorResponse error = ErrorResponse.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .message("The requested sector could not be found.")
                .timestamp(LocalDateTime.now())
                .path(request.getRequestURI())
                .build();
        
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    /**
     * Handle validation exceptions from request body validation.
     * Returns structured validation error response with field-specific errors.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidationExceptions(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {
        
        BindingResult bindingResult = ex.getBindingResult();
        List<FieldError> fieldErrors = new ArrayList<>();
        
        bindingResult.getFieldErrors().forEach(error -> {
            FieldError fieldError = FieldError.builder()
                    .field(error.getField())
                    .rejectedValue(error.getRejectedValue())
                    .message(error.getDefaultMessage())
                    .build();
            fieldErrors.add(fieldError);
        });
        
        logger.debug("Validation errors: {} errors found - Path: {}", fieldErrors.size(), request.getRequestURI());
        
        ValidationErrorResponse response = ValidationErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message("Validation failed for one or more fields")
                .errors(fieldErrors)
                .timestamp(LocalDateTime.now())
                .path(request.getRequestURI())
                .build();
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Handle data integrity violations (e.g., unique constraint violations).
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(
            DataIntegrityViolationException ex, 
            HttpServletRequest request) {
        
        logger.error("Data integrity violation: {} - Path: {}", ex.getMessage(), request.getRequestURI());
        
        String message = "A data conflict occurred. Please check your input and try again.";
        
        // Provide more specific messages for common constraint violations
        if (ex.getMessage() != null) {
            if (ex.getMessage().contains("unique constraint") || ex.getMessage().contains("duplicate key")) {
                message = "A record with this information already exists.";
            } else if (ex.getMessage().contains("foreign key constraint")) {
                message = "Cannot complete operation due to related data constraints.";
            } else if (ex.getMessage().contains("not-null constraint")) {
                message = "Required field is missing.";
            }
        }
        
        ErrorResponse error = ErrorResponse.builder()
                .status(HttpStatus.CONFLICT.value())
                .message(message)
                .timestamp(LocalDateTime.now())
                .path(request.getRequestURI())
                .build();
        
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }
    
    /**
     * Handle general database access exceptions.
     */
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ErrorResponse> handleDataAccessException(
            DataAccessException ex,
            HttpServletRequest request) {
        
        logger.error("Database access error: {} - Path: {}", ex.getMessage(), request.getRequestURI(), ex);
        
        ErrorResponse error = ErrorResponse.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message("A database error occurred. Please try again later.")
                .timestamp(LocalDateTime.now())
                .path(request.getRequestURI())
                .build();
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
    
    /**
     * Handle Kafka messaging exceptions.
     */
    @ExceptionHandler(KafkaException.class)
    public ResponseEntity<ErrorResponse> handleKafkaException(
            KafkaException ex,
            HttpServletRequest request) {
        
        logger.error("Kafka messaging error: {} - Path: {}", ex.getMessage(), request.getRequestURI(), ex);
        
        ErrorResponse error = ErrorResponse.builder()
                .status(HttpStatus.SERVICE_UNAVAILABLE.value())
                .message("A messaging service error occurred. The operation may be retried automatically.")
                .timestamp(LocalDateTime.now())
                .path(request.getRequestURI())
                .build();
        
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
    }
    
    /**
     * Handle illegal argument exceptions.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
            IllegalArgumentException ex,
            HttpServletRequest request) {
        
        logger.warn("Invalid argument: {} - Path: {}", ex.getMessage(), request.getRequestURI());
        
        ErrorResponse error = ErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message("Invalid request parameter. Please check your input.")
                .timestamp(LocalDateTime.now())
                .path(request.getRequestURI())
                .build();
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
    
    /**
     * Handle illegal state exceptions.
     */
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponse> handleIllegalStateException(
            IllegalStateException ex,
            HttpServletRequest request) {
        
        logger.error("Illegal state: {} - Path: {}", ex.getMessage(), request.getRequestURI());
        
        ErrorResponse error = ErrorResponse.builder()
                .status(HttpStatus.CONFLICT.value())
                .message("The operation cannot be completed in the current state.")
                .timestamp(LocalDateTime.now())
                .path(request.getRequestURI())
                .build();
        
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    /**
     * Handle all other uncaught exceptions.
     * Ensures system internals are not exposed to clients.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
            Exception ex, 
            HttpServletRequest request) {
        
        logger.error("Unexpected error occurred: {} - Path: {}", ex.getMessage(), request.getRequestURI(), ex);
        
        ErrorResponse error = ErrorResponse.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message("An unexpected error occurred. Please try again later.")
                .timestamp(LocalDateTime.now())
                .path(request.getRequestURI())
                .build();
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}