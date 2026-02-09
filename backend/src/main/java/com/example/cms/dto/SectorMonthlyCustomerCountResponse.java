package com.example.cms.dto;

//  import lombok.AllArgsConstructor;
public record SectorMonthlyCustomerCountResponse(
        Long sectorId,
        String sectorCode,
        int year,
        int month,
        long count
) {}
