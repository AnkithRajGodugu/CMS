package com.example.cms.service;

import com.example.cms.entity.Sector;
import com.example.cms.entity.User;
import com.example.cms.exception.SectorNotAssignedException;
import com.example.cms.exception.SectorNotFoundException;
import com.example.cms.model.SectorContext;
import com.example.cms.repository.SectorRepository;
import com.example.cms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service responsible for detecting and managing sector context for users.
 * Provides caching for improved performance.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SectorDetectionService {
    
    private final UserRepository userRepository;
    private final SectorRepository sectorRepository;
    
    /**
     * Detects the sector for the authenticated user and builds a SectorContext.
     * Results are cached to improve performance.
     *
     * @param authentication The Spring Security authentication object
     * @return SectorContext containing sector and user information
     * @throws SectorNotAssignedException if the user has no sector assigned
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "sectorContext", key = "#authentication.name")
    public SectorContext detectSector(Authentication authentication) {
        log.debug("Detecting sector for user: {}", authentication.getName());
        
        // Extract username from authentication
        String username = authentication.getName();
        
        // Fetch user from database
        User user = userRepository.findByUsername(username);
        if (user == null) {
            log.error("User not found: {}", username);
            throw new SectorNotAssignedException("User not found: " + username);
        }
        
        // Check if user has a sector assigned
        if (user.getSector() == null) {
            log.warn("User {} has no sector assigned", username);
            throw new SectorNotAssignedException("User has no sector assigned. Please contact administrator.");
        }
        
        Sector sector = user.getSector();
        
        // Build and return SectorContext
        SectorContext context = SectorContext.builder()
                .sectorId(sector.getId())
                .sectorCode(sector.getCode())
                .userId(user.getId())
                .organizationId(user.getOrganization() != null ? user.getOrganization().getId() : null)
                .userType(user.getUserType())
                .roles(user.getRoles())
                .build();
        
        log.info("Sector detected for user {}: {} ({})", username, sector.getName(), sector.getCode());
        
        return context;
    }
    
    /**
     * Detects sector by username. Useful for scenarios where Authentication object is not available.
     *
     * @param username The username to detect sector for
     * @return SectorContext containing sector and user information
     * @throws SectorNotAssignedException if the user has no sector assigned
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "sectorContext", key = "#username")
    public SectorContext detectSectorByUsername(String username) {
        log.debug("Detecting sector for username: {}", username);
        
        User user = userRepository.findByUsername(username);
        if (user == null) {
            log.error("User not found: {}", username);
            throw new SectorNotAssignedException("User not found: " + username);
        }
        
        if (user.getSector() == null) {
            log.warn("User {} has no sector assigned", username);
            throw new SectorNotAssignedException("User has no sector assigned. Please contact administrator.");
        }
        
        Sector sector = user.getSector();
        
        return SectorContext.builder()
                .sectorId(sector.getId())
                .sectorCode(sector.getCode())
                .userId(user.getId())
                .organizationId(user.getOrganization() != null ? user.getOrganization().getId() : null)
                .userType(user.getUserType())
                .roles(user.getRoles())
                .build();
    }
    
    /**
     * Gets the route path for a given sector ID.
     * Results are cached for improved performance.
     *
     * @param sectorId The sector ID
     * @return The route path (e.g., "/banking", "/healthcare")
     * @throws SectorNotFoundException if the sector is not found
     */
    @Cacheable(value = "sectorRoutePath", key = "#sectorId")
    public String getSectorRoutePath(Long sectorId) {
        log.debug("Getting route path for sector ID: {}", sectorId);
        
        Sector sector = sectorRepository.findById(sectorId)
                .orElseThrow(() -> {
                    log.error("Sector not found with ID: {}", sectorId);
                    return new SectorNotFoundException("Sector not found with ID: " + sectorId);
                });
        
        log.debug("Route path for sector {}: {}", sector.getName(), sector.getRoutePath());
        return sector.getRoutePath();
    }
    
    /**
     * Gets the route path for a given sector code.
     *
     * @param sectorCode The sector code (e.g., "BANKING", "HEALTHCARE")
     * @return The route path (e.g., "/banking", "/healthcare")
     * @throws SectorNotFoundException if the sector is not found
     */
    @Cacheable(value = "sectorRoutePath", key = "#sectorCode")
    public String getSectorRoutePathByCode(String sectorCode) {
        log.debug("Getting route path for sector code: {}", sectorCode);
        
        Sector sector = sectorRepository.findAll().stream()
                .filter(s -> s.getCode().equalsIgnoreCase(sectorCode))
                .findFirst()
                .orElseThrow(() -> {
                    log.error("Sector not found with code: {}", sectorCode);
                    return new SectorNotFoundException("Sector not found with code: " + sectorCode);
                });
        
        log.debug("Route path for sector {}: {}", sector.getName(), sector.getRoutePath());
        return sector.getRoutePath();
    }
}
