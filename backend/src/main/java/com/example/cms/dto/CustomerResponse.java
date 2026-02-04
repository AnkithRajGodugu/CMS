package com.example.cms.dto;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class CustomerResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private LocalDateTime createdAt;

    public CustomerResponse(
            Long id,
            String firstName,
            String lastName,
            String email,
            String phone,
            LocalDateTime createdAt
    ) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.createdAt = createdAt;
    }
}
