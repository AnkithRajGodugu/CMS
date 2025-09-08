// Updated Customer.java (added sector relation)
package com.example.cms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "customers")
@Data
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "First name is required")
    private String firstName;

    @NotNull(message = "Last name is required")
    private String lastName;

    @Email(message = "Invalid email")
    private String email;

    private String phone;

    @ManyToOne
    @JoinColumn(name = "sector_id")
    private Sector sector;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}