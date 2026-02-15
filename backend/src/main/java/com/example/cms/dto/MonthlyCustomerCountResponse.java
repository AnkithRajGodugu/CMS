package com.example.cms.dto;

public record MonthlyCustomerCountResponse(
        Integer year,
        Integer month,
        Long count
) {}
