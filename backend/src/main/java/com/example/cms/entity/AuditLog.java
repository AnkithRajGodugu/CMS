package com.example.cms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "audit_log", indexes = {
    @Index(name = "idx_audit_user_id", columnList = "user_id"),
    @Index(name = "idx_audit_sector_id", columnList = "sector_id"),
    @Index(name = "idx_audit_organization_id", columnList = "organization_id"),
    @Index(name = "idx_audit_timestamp", columnList = "timestamp"),
    @Index(name = "idx_audit_action", columnList = "action"),
    @Index(name = "idx_audit_resource_type", columnList = "resource_type"),
    @Index(name = "idx_audit_user_timestamp", columnList = "user_id, timestamp")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;
    
    @Column(name = "sector_id")
    private Long sectorId;
    
    @Column(name = "organization_id")
    private Long organizationId;
    
    @Column(nullable = false, length = 255)
    private String action;
    
    @Column(name = "resource_type", length = 255)
    private String resourceType;
    
    @Column(name = "resource_id", length = 255)
    private String resourceId;


    @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private java.util.Map<String, Object> details;
    
    @Column(name = "ip_address", length = 45)
    private String ipAddress;
    
    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
    
    @Column(length = 50)
    private String status;
    
    @Column(name = "error_message", length = 1000)
    private String errorMessage;
}
