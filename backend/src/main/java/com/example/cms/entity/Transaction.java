package com.example.cms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "transactions", indexes = {
    @Index(name = "idx_transactions_transaction_id", columnList = "transactionId"),
    @Index(name = "idx_transactions_account_number", columnList = "accountNumber"),
    @Index(name = "idx_transactions_status", columnList = "status"),
    @Index(name = "idx_transactions_type", columnList = "type"),
    @Index(name = "idx_transactions_created_at", columnList = "createdAt"),
    @Index(name = "idx_transactions_processed_at", columnList = "processedAt"),
    @Index(name = "idx_transactions_account_status_date", columnList = "accountNumber, status, createdAt")
})
@SQLDelete(sql = "UPDATE transactions SET deleted = true WHERE id=?")
@SQLRestriction("deleted = false")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Transaction ID is required")
    @Column(unique = true)
    private String transactionId;

    @NotNull(message = "Transaction type is required")
    @Enumerated(EnumType.STRING)
    private TransactionType type;

    @NotNull(message = "Amount is required")
    @Column(precision = 15, scale = 2)
    private BigDecimal amount;

    @NotNull(message = "Account number is required")
    private String accountNumber;

    @Enumerated(EnumType.STRING)
    private TransactionStatus status = TransactionStatus.PENDING;

    private String description;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime processedAt;

    @Column(name = "deleted", nullable = false)
    private boolean deleted = false;

    public enum TransactionType {
        DEPOSIT, WITHDRAWAL, TRANSFER, PAYMENT
    }

    public enum TransactionStatus {
        PENDING, COMPLETED, FAILED, CANCELLED
    }

    // Constructors
    public Transaction() {}

    public Transaction(String transactionId, TransactionType type, BigDecimal amount, String accountNumber) {
        this.transactionId = transactionId;
        this.type = type;
        this.amount = amount;
        this.accountNumber = accountNumber;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public TransactionType getType() { return type; }
    public void setType(TransactionType type) { this.type = type; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public TransactionStatus getStatus() { return status; }
    public void setStatus(TransactionStatus status) { 
        this.status = status;
        if (status == TransactionStatus.COMPLETED) {
            this.processedAt = LocalDateTime.now();
        }
    }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getProcessedAt() { return processedAt; }
    public void setProcessedAt(LocalDateTime processedAt) { this.processedAt = processedAt; }

    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }
}