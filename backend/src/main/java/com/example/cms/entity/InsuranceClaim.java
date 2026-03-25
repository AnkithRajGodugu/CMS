package com.example.cms.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "insurance_claims")
public class InsuranceClaim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patientName;
    private Double amount;
    
    @Enumerated(EnumType.STRING)
    private ClaimStatus status;

    private LocalDateTime submittedAt = LocalDateTime.now();

    public enum ClaimStatus {
        APPROVED, PENDING, DENIED
    }

    public InsuranceClaim() {}

    public InsuranceClaim(String patientName, Double amount, ClaimStatus status) {
        this.patientName = patientName;
        this.amount = amount;
        this.status = status;
    }

    public Long getId() { return id; }
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public ClaimStatus getStatus() { return status; }
    public void setStatus(ClaimStatus status) { this.status = status; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
}
