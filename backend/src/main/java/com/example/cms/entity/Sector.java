package com.example.cms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sectors", indexes = {
    @Index(name = "idx_sectors_code", columnList = "code"),
    @Index(name = "idx_sectors_enabled", columnList = "enabled"),
    @Index(name = "idx_sectors_display_order", columnList = "display_order")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sector {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;
    
    private String icon;
    
    @Column(name = "route_path", nullable = false)
    private String routePath;
    
    @Column(columnDefinition = "jsonb")
    private String configuration;
    
    @Column(nullable = false)
    @Builder.Default
    private boolean enabled = true;
    
    @Column(name = "display_order")
    @Builder.Default
    private int displayOrder = 0;
    
    // Backward compatibility constructor
    public Sector(String name, String description) {
        this.code = name.toUpperCase().replace(" ", "_").replace("&", "AND");
        this.name = name;
        this.description = description;
        this.routePath = "/" + name.toLowerCase().replace(" ", "-").replace("&", "");
        this.enabled = true;
        this.displayOrder = 0;
    }
}