package com.example.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganizationRequest {
    
    private String name;
    private String domain;
    private Long sectorId;
    private java.util.Map<String, Object> settings;
    private boolean active;
}
