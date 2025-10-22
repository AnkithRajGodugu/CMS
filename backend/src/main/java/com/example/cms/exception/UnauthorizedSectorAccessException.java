package com.example.cms.exception;

/**
 * Exception thrown when a user attempts to access a sector they are not authorized for.
 */
public class UnauthorizedSectorAccessException extends RuntimeException {
    
    public UnauthorizedSectorAccessException(String message) {
        super(message);
    }
    
    public UnauthorizedSectorAccessException(String message, Throwable cause) {
        super(message, cause);
    }
}
