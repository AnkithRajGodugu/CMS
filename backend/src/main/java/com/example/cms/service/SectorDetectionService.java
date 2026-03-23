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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

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
     * Detect sector using Authentication object.
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "sectorContext", key = "#authentication.name")
    public SectorContext detectSector(Authentication authentication) {

        String username = authentication.getName();

        log.debug("Detecting sector for user: {}", username);

        User user = userRepository.findByUsername(username);
        if (user == null) {
            log.error("User not found: {}", username);
            throw new SectorNotAssignedException("User not found: " + username);
        }

        if (user.getSector() == null) {
            log.warn("User {} has no sector assigned", username);
            throw new SectorNotAssignedException(
                    "User has no sector assigned. Please contact administrator."
            );
        }

        Sector sector = user.getSector();

        // ✅ FIX: Convert single entity role into Spring Security ROLE_ format
        Set<String> formattedRoles = Set.of("ROLE_" + user.getRole().name());

        SectorContext context = SectorContext.builder()
                .sectorId(sector.getId())
                .sectorCode(sector.getCode())
                .userId(user.getId())
                .organizationId(
                        user.getOrganization() != null
                                ? user.getOrganization().getId()
                                : null
                )
                .userType(user.getUserType())
                .roles(formattedRoles)
                .build();

        log.info("Sector detected for user {}: {} ({})",
                username,
                sector.getName(),
                sector.getCode());

        return context;
    }

    /**
     * Detect sector by username (without Authentication object).
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "sectorContext", key = "#p0")
    public SectorContext detectSectorByUsername(String username) {

        log.debug("Detecting sector for username: {}", username);

        User user = userRepository.findByUsername(username);
        if (user == null) {
            log.error("User not found: {}", username);
            throw new SectorNotAssignedException("User not found: " + username);
        }

        if (user.getSector() == null) {
            log.warn("User {} has no sector assigned", username);
            throw new SectorNotAssignedException(
                    "User has no sector assigned. Please contact administrator."
            );
        }

        Sector sector = user.getSector();

        Set<String> formattedRoles = Set.of("ROLE_" + user.getRole().name());

        return SectorContext.builder()
                .sectorId(sector.getId())
                .sectorCode(sector.getCode())
                .userId(user.getId())
                .organizationId(
                        user.getOrganization() != null
                                ? user.getOrganization().getId()
                                : null
                )
                .userType(user.getUserType())
                .roles(formattedRoles)
                .build();
    }

    /**
     * Get route path by sector ID.
     */
    @Cacheable(value = "sectorRoutePath", key = "#sectorId")
    public String getSectorRoutePath(Long sectorId) {

        log.debug("Getting route path for sector ID: {}", sectorId);

        Sector sector = sectorRepository.findById(sectorId)
                .orElseThrow(() -> {
                    log.error("Sector not found with ID: {}", sectorId);
                    return new SectorNotFoundException(
                            "Sector not found with ID: " + sectorId
                    );
                });

        return sector.getRoutePath();
    }

    /**
     * Get route path by sector code.
     */
    @Cacheable(value = "sectorRoutePath", key = "#sectorCode")
    public String getSectorRoutePathByCode(String sectorCode) {

        log.debug("Getting route path for sector code: {}", sectorCode);

        Sector sector = sectorRepository.findAll().stream()
                .filter(s -> s.getCode().equalsIgnoreCase(sectorCode))
                .findFirst()
                .orElseThrow(() -> {
                    log.error("Sector not found with code: {}", sectorCode);
                    return new SectorNotFoundException(
                            "Sector not found with code: " + sectorCode
                    );
                });

        return sector.getRoutePath();
    }
}