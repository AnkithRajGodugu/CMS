package com.example.cms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "organizations", indexes = {
    @Index(name = "idx_organizations_sector_id", columnList = "sector_id"),
    @Index(name = "idx_organizations_active", columnList = "active"),
    @Index(name = "idx_organizations_domain", columnList = "domain")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Organization {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    private String domain;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sector_id", nullable = false)
    private Sector sector;
    
    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL)
    private List<User> users;
    
    @Column(columnDefinition = "jsonb")
    private String settings;
    
    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
