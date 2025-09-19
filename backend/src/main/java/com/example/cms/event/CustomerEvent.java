package com.example.cms.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerEvent {
    private Long customerId;
    private String eventType; // CREATED, UPDATED, DELETED
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String sectorName;
    private LocalDateTime timestamp;
    private String performedBy;
}