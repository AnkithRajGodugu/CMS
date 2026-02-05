package com.example.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MonthlyCustomerCountResponse {

    private int year;
    private int month;
    private long count;
}
