package com.example.cms.service;

import com.example.cms.dto.OrganizationRequest;
import com.example.cms.dto.OrganizationResponse;
import com.example.cms.entity.Organization;
import com.example.cms.entity.Sector;
import com.example.cms.entity.User;
import com.example.cms.exception.SectorNotFoundException;
import com.example.cms.repository.OrganizationRepository;
import com.example.cms.repository.SectorRepository;
import com.example.cms.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrganizationService {
    
    private final OrganizationRepository organizationRepository;
    private final SectorRepository sectorRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final AuditService auditService;
    
    /**
     * Get all organizations
     */
    @Transactional(readOnly = true)
    public List<OrganizationResponse> getAllOrganizations() {
        log.info("Fetching all organizations");
        return organizationRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Get organization by ID
     */
    @Transactional(readOnly = true)
    public OrganizationResponse getOrganizationById(Long id) {
        log.info("Fetching organization with id: {}", id);
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organization not found with id: " + id));
        return mapToResponse(organization);
    }
    
    /**
     * Get organizations by sector
     */
    @Transactional(readOnly = true)
    public List<OrganizationResponse> getOrganizationsBySector(Long sectorId) {
        log.info("Fetching organizations for sector: {}", sectorId);
        return organizationRepository.findBySectorId(sectorId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Get active organizations
     */
    @Transactional(readOnly = true)
    public List<OrganizationResponse> getActiveOrganizations() {
        log.info("Fetching active organizations");
        return organizationRepository.findByActiveTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Create a new organization
     */
    @Transactional
    public OrganizationResponse createOrganization(OrganizationRequest request) {
        log.info("Creating new organization: {}", request.getName());
        
        // Validate sector exists
        Sector sector = sectorRepository.findById(request.getSectorId())
                .orElseThrow(() -> new SectorNotFoundException("Sector not found with id: " + request.getSectorId()));
        
        // Create organization
        Organization organization = Organization.builder()
                .name(request.getName())
                .domain(request.getDomain())
                .sector(sector)
                .settings(request.getSettings())
                .active(request.isActive())
                .build();
        
        Organization savedOrganization = organizationRepository.save(organization);
        log.info("Organization created successfully with id: {}", savedOrganization.getId());
        
        // Log organization creation
        auditService.logAction(null, sector.getId(), savedOrganization.getId(), 
                "ORGANIZATION_CREATED", "ORGANIZATION", savedOrganization.getId().toString(), null, null);
        
        return mapToResponse(savedOrganization);
    }
    
    /**
     * Update an existing organization
     */
    @Transactional
    public OrganizationResponse updateOrganization(Long id, OrganizationRequest request) {
        log.info("Updating organization with id: {}", id);
        
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organization not found with id: " + id));
        
        // Update fields
        if (request.getName() != null) {
            organization.setName(request.getName());
        }
        if (request.getDomain() != null) {
            organization.setDomain(request.getDomain());
        }
        if (request.getSectorId() != null) {
            Sector sector = sectorRepository.findById(request.getSectorId())
                    .orElseThrow(() -> new SectorNotFoundException("Sector not found with id: " + request.getSectorId()));
            organization.setSector(sector);
        }
        if (request.getSettings() != null) {
            organization.setSettings(request.getSettings());
        }
        organization.setActive(request.isActive());
        
        Organization updatedOrganization = organizationRepository.save(organization);
        log.info("Organization updated successfully with id: {}", updatedOrganization.getId());
        
        // Log organization update
        auditService.logAction(null, updatedOrganization.getSector().getId(), updatedOrganization.getId(), 
                "ORGANIZATION_UPDATED", "ORGANIZATION", updatedOrganization.getId().toString(), null, null);
        
        return mapToResponse(updatedOrganization);
    }
    
    /**
     * Delete an organization
     */
    @Transactional
    public void deleteOrganization(Long id) {
        log.info("Deleting organization with id: {}", id);
        
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organization not found with id: " + id));
        
        organizationRepository.delete(organization);
        log.info("Organization deleted successfully with id: {}", id);
        
        // Log organization deletion
        auditService.logAction(null, organization.getSector().getId(), organization.getId(), 
                "ORGANIZATION_DELETED", "ORGANIZATION", organization.getId().toString(), null, null);
    }
    
    /**
     * Update organization settings (JSONB field)
     */
    @Transactional
    public OrganizationResponse updateOrganizationSettings(Long id, Map<String, Object> settings) {
        log.info("Updating settings for organization with id: {}", id);
        
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organization not found with id: " + id));
        
        try {
            String settingsJson = objectMapper.writeValueAsString(settings);
            organization.setSettings(settingsJson);
            Organization updatedOrganization = organizationRepository.save(organization);
            log.info("Organization settings updated successfully for id: {}", id);
            return mapToResponse(updatedOrganization);
        } catch (JsonProcessingException e) {
            log.error("Error serializing settings to JSON", e);
            throw new RuntimeException("Error updating organization settings", e);
        }
    }
    
    /**
     * Get organization settings
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getOrganizationSettings(Long id) {
        log.info("Fetching settings for organization with id: {}", id);
        
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organization not found with id: " + id));
        
        if (organization.getSettings() == null || organization.getSettings().isEmpty()) {
            return new HashMap<>();
        }
        
        try {
            return objectMapper.readValue(organization.getSettings(), Map.class);
        } catch (JsonProcessingException e) {
            log.error("Error deserializing settings from JSON", e);
            return new HashMap<>();
        }
    }
    
    /**
     * Add user to organization
     */
    @Transactional
    public void addUserToOrganization(Long organizationId, Long userId) {
        log.info("Adding user {} to organization {}", userId, organizationId);
        
        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new RuntimeException("Organization not found with id: " + organizationId));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        user.setOrganization(organization);
        userRepository.save(user);
        log.info("User {} added to organization {} successfully", userId, organizationId);
        
        // Log user added to organization
        auditService.logAction(userId, organization.getSector().getId(), organizationId, 
                "USER_ADDED_TO_ORGANIZATION", "USER", userId.toString(), null, null);
    }
    
    /**
     * Remove user from organization
     */
    @Transactional
    public void removeUserFromOrganization(Long userId) {
        log.info("Removing user {} from organization", userId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        user.setOrganization(null);
        userRepository.save(user);
        log.info("User {} removed from organization successfully", userId);
    }
    
    /**
     * Get users in organization
     */
    @Transactional(readOnly = true)
    public List<User> getOrganizationUsers(Long organizationId) {
        log.info("Fetching users for organization: {}", organizationId);
        
        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new RuntimeException("Organization not found with id: " + organizationId));
        
        return organization.getUsers();
    }
    
    /**
     * Map Organization entity to OrganizationResponse DTO
     */
    private OrganizationResponse mapToResponse(Organization organization) {
        return OrganizationResponse.builder()
                .id(organization.getId())
                .name(organization.getName())
                .domain(organization.getDomain())
                .sectorId(organization.getSector().getId())
                .sectorName(organization.getSector().getName())
                .settings(organization.getSettings())
                .active(organization.isActive())
                .createdAt(organization.getCreatedAt())
                .userCount(organization.getUsers() != null ? organization.getUsers().size() : 0)
                .build();
    }
}
