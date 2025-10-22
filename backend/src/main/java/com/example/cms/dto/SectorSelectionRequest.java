package com.example.cms.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for sector selection endpoint
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SectorSelectionRequest {
    
    @NotNull(message = "Sector ID is required")
    private Long sectorId;
}
