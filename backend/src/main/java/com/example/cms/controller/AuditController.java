package com.example.cms.controller;

import com.example.cms.entity.AuditLog;
import com.example.cms.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
@Slf4j
public class AuditController {

    private final AuditLogRepository auditLogRepository;

    /**
     * Get paginated audit logs.
     * Supports basic filtering by organizationId or sectorId.
     * Requires ADMIN role.
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<AuditLog>> getAuditLogs(
            @RequestParam(required = false) Long organizationId,
            @RequestParam(required = false) Long sectorId,
            @RequestParam(required = false) Long userId,
            @PageableDefault(size = 20, sort = "timestamp", direction = Sort.Direction.DESC) Pageable pageable) {
        
        log.info("GET /api/audit-logs - Fetching audit logs");

        if (organizationId != null) {
            return ResponseEntity.ok(auditLogRepository.findByOrganizationId(organizationId, pageable));
        } else if (sectorId != null) {
            return ResponseEntity.ok(auditLogRepository.findBySectorId(sectorId, pageable));
        } else if (userId != null) {
            return ResponseEntity.ok(auditLogRepository.findByUserId(userId, pageable));
        }

        // Return all logs if no filters provided
        return ResponseEntity.ok(auditLogRepository.findAll(pageable));
    }
}
