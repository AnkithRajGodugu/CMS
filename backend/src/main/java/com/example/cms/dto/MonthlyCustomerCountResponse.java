package com.example.cms.dto;

public record MonthlyCustomerCountResponse(
        int year,
        int month,
        long count
) {}

