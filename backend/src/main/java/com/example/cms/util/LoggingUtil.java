package com.example.cms.util;

import org.slf4j.MDC;

/**
 * Utility class for structured logging with MDC (Mapped Diagnostic Context).
 * Provides methods to add contextual information to logs.
 */
public class LoggingUtil {
    
    // MDC Keys
    public static final String USER_ID = "userId";
    public static final String SECTOR_ID = "sectorId";
    public static final String ORGANIZATION_ID = "organizationId";
    public static final String REQUEST_ID = "requestId";
    public static final String IP_ADDRESS = "ipAddress";
    public static final String ACTION = "action";
    public static final String RESOURCE_TYPE = "resourceType";
    public static final String RESOURCE_ID = "resourceId";
    
    /**
     * Set user ID in MDC context
     */
    public static void setUserId(Long userId) {
        if (userId != null) {
            MDC.put(USER_ID, userId.toString());
        }
    }
    
    /**
     * Set sector ID in MDC context
     */
    public static void setSectorId(Long sectorId) {
        if (sectorId != null) {
            MDC.put(SECTOR_ID, sectorId.toString());
        }
    }
    
    /**
     * Set organization ID in MDC context
     */
    public static void setOrganizationId(Long organizationId) {
        if (organizationId != null) {
            MDC.put(ORGANIZATION_ID, organizationId.toString());
        }
    }
    
    /**
     * Set request ID in MDC context
     */
    public static void setRequestId(String requestId) {
        if (requestId != null) {
            MDC.put(REQUEST_ID, requestId);
        }
    }
    
    /**
     * Set IP address in MDC context
     */
    public static void setIpAddress(String ipAddress) {
        if (ipAddress != null) {
            MDC.put(IP_ADDRESS, ipAddress);
        }
    }
    
    /**
     * Set action in MDC context
     */
    public static void setAction(String action) {
        if (action != null) {
            MDC.put(ACTION, action);
        }
    }
    
    /**
     * Set resource type in MDC context
     */
    public static void setResourceType(String resourceType) {
        if (resourceType != null) {
            MDC.put(RESOURCE_TYPE, resourceType);
        }
    }
    
    /**
     * Set resource ID in MDC context
     */
    public static void setResourceId(String resourceId) {
        if (resourceId != null) {
            MDC.put(RESOURCE_ID, resourceId);
        }
    }
    
    /**
     * Clear all MDC context
     */
    public static void clear() {
        MDC.clear();
    }
    
    /**
     * Clear specific MDC key
     */
    public static void remove(String key) {
        MDC.remove(key);
    }
}
