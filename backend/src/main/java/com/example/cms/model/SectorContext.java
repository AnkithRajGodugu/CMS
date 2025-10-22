package com.example.cms.model;

import com.example.cms.entity.UserType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

/**
 * SectorContext holds the sector-related information for a user's request.
 * This context is used throughout the application to enforce sector-based authorization
 * and provide sector-specific functionality.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SectorContext {
    
    /**
     * The unique identifier of the sector
     */
    private Long sectorId;
    
    /**
     * The sector code (e.g., BANKING, HEALTHCARE, EDUCATION)
     */
    private String sectorCode;
    
    /**
     * The unique identifier of the user
     */
    private Long userId;
    
    /**
     * The unique identifier of the organization (null for individual users)
     */
    private Long organizationId;
    
    /**
     * The type of user (INDIVIDUAL or ORGANIZATION)
     */
    private UserType userType;
    
    /**
     * The roles assigned to the user
     */
    private Set<String> roles;
}
