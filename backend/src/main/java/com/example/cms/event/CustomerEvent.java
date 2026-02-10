package com.example.cms.event;

import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CustomerEvent {

    private Long customerId;
    private CustomerEventType eventType;

    private String firstName;
    private String lastName;
    private String email;
    private String phone;

    private String sectorName;
    private Long userId;

    private LocalDateTime timestamp;
}
