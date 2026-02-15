package com.example.cms.dto;

public record SectorMonthlyCustomerCountResponse(
        Long sectorId,
        String sectorCode,
        Integer year,
        Integer month,
        Long count
) {}