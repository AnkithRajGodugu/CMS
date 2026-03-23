package com.example.cms.controller;

import com.example.cms.dto.OrganizationRequest;
import com.example.cms.dto.OrganizationResponse;
import com.example.cms.entity.User;
import com.example.cms.service.OrganizationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/organizations")
@RequiredArgsConstructor
@Slf4j
public class OrganizationController {
    
    private final OrganizationService organizationService;
    
    /**
     * Get all organizations
     * Requires ADMIN role
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<org.springframework.data.domain.Page<OrganizationResponse>> getAllOrganizations(
            @org.springframework.data.web.PageableDefault(size = 20) org.springframework.data.domain.Pageable pageable) {
        log.info("GET /api/organizations - Fetching all organizations");
        org.springframework.data.domain.Page<OrganizationResponse> organizations = organizationService.getAllOrganizations(pageable);
        return ResponseEntity.ok(organizations);
    }
    
    /**
     * Get organization by ID
     * Requires ADMIN or MANAGER role
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<OrganizationResponse> getOrganizationById(@PathVariable Long id) {
        log.info("GET /api/organizations/{} - Fetching organization", id);
        OrganizationResponse organization = organizationService.getOrganizationById(id);
        return ResponseEntity.ok(organization);
    }
    
    /**
     * Get organizations by sector
     * Requires ADMIN or MANAGER role
     */
    @GetMapping("/sector/{sectorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<org.springframework.data.domain.Page<OrganizationResponse>> getOrganizationsBySector(
            @PathVariable Long sectorId,
            @org.springframework.data.web.PageableDefault(size = 20) org.springframework.data.domain.Pageable pageable) {
        log.info("GET /api/organizations/sector/{} - Fetching organizations by sector", sectorId);
        org.springframework.data.domain.Page<OrganizationResponse> organizations = organizationService.getOrganizationsBySector(sectorId, pageable);
        return ResponseEntity.ok(organizations);
    }
    
    /**
     * Get active organizations
     * Requires ADMIN or MANAGER role
     */
    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<org.springframework.data.domain.Page<OrganizationResponse>> getActiveOrganizations(
            @org.springframework.data.web.PageableDefault(size = 20) org.springframework.data.domain.Pageable pageable) {
        log.info("GET /api/organizations/active - Fetching active organizations");
        org.springframework.data.domain.Page<OrganizationResponse> organizations = organizationService.getActiveOrganizations(pageable);
        return ResponseEntity.ok(organizations);
    }
    
    /**
     * Create a new organization
     * Requires ADMIN role
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrganizationResponse> createOrganization(@RequestBody OrganizationRequest request) {
        log.info("POST /api/organizations - Creating new organization: {}", request.getName());
        OrganizationResponse organization = organizationService.createOrganization(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(organization);
    }
    
    /**
     * Update an existing organization
     * Requires ADMIN role
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrganizationResponse> updateOrganization(
            @PathVariable Long id,
            @RequestBody OrganizationRequest request) {
        log.info("PUT /api/organizations/{} - Updating organization", id);
        OrganizationResponse organization = organizationService.updateOrganization(id, request);
        return ResponseEntity.ok(organization);
    }
    
    /**
     * Delete an organization
     * Requires ADMIN role
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteOrganization(@PathVariable Long id) {
        log.info("DELETE /api/organizations/{} - Deleting organization", id);
        organizationService.deleteOrganization(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Update organization settings
     * Requires ADMIN or MANAGER role
     */
    @PutMapping("/{id}/settings")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<OrganizationResponse> updateOrganizationSettings(
            @PathVariable Long id,
            @RequestBody Map<String, Object> settings) {
        log.info("PUT /api/organizations/{}/settings - Updating organization settings", id);
        OrganizationResponse organization = organizationService.updateOrganizationSettings(id, settings);
        return ResponseEntity.ok(organization);
    }
    
    /**
     * Get organization settings
     * Requires ADMIN or MANAGER role
     */
    @GetMapping("/{id}/settings")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Map<String, Object>> getOrganizationSettings(@PathVariable Long id) {
        log.info("GET /api/organizations/{}/settings - Fetching organization settings", id);
        Map<String, Object> settings = organizationService.getOrganizationSettings(id);
        return ResponseEntity.ok(settings);
    }
    
    /**
     * Add user to organization
     * Requires ADMIN or MANAGER role
     */
    @PostMapping("/{organizationId}/users/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Void> addUserToOrganization(
            @PathVariable Long organizationId,
            @PathVariable Long userId) {
        log.info("POST /api/organizations/{}/users/{} - Adding user to organization", organizationId, userId);
        organizationService.addUserToOrganization(organizationId, userId);
        return ResponseEntity.ok().build();
    }
    
    /**
     * Remove user from organization
     * Requires ADMIN or MANAGER role
     */
    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Void> removeUserFromOrganization(@PathVariable Long userId) {
        log.info("DELETE /api/organizations/users/{} - Removing user from organization", userId);
        organizationService.removeUserFromOrganization(userId);
        return ResponseEntity.ok().build();
    }
    
    /**
     * Get users in organization
     * Requires ADMIN or MANAGER role
     */
    @GetMapping("/{organizationId}/users")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<User>> getOrganizationUsers(@PathVariable Long organizationId) {
        log.info("GET /api/organizations/{}/users - Fetching organization users", organizationId);
        List<User> users = organizationService.getOrganizationUsers(organizationId);
        return ResponseEntity.ok(users);
    }
}
