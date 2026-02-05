package com.example.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SectorMonthlyCustomerCountResponse {

    private Long sectorId;
    private String sectorCode;
    private int year;
    private int month;
    private long count;
}
