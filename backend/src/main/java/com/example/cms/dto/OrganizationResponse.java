package com.example.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganizationResponse {
    
    private Long id;
    private String name;
    private String domain;
    private Long sectorId;
    private String sectorName;
    private java.util.Map<String, Object> settings;
    private boolean active;
    private LocalDateTime createdAt;
    private int userCount;
}
