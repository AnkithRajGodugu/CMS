package com.example.cms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "routes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String startLocation;

    @Column(nullable = false)
    private String endLocation;

    private Double distanceKm;

    private Integer estimatedTimeMinutes;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private RouteOptimizationStatus status;

    public enum RouteOptimizationStatus {
        OPTIMIZED, PENDING, BLOCKED
    }
}
