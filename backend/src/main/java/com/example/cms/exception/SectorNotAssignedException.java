package com.example.cms.exception;

/**
 * Exception thrown when a user attempts to access the system but has no sector assigned.
 */
public class SectorNotAssignedException extends RuntimeException {
    
    public SectorNotAssignedException(String message) {
        super(message);
    }
    
    public SectorNotAssignedException(String message, Throwable cause) {
        super(message, cause);
    }
}
