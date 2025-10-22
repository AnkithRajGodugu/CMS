package com.example.cms.exception;

/**
 * Exception thrown when a requested sector cannot be found in the system.
 */
public class SectorNotFoundException extends RuntimeException {
    
    public SectorNotFoundException(String message) {
        super(message);
    }
    
    public SectorNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
