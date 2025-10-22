package com.example.cms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bank_accounts", indexes = {
    @Index(name = "idx_bank_accounts_account_number", columnList = "accountNumber"),
    @Index(name = "idx_bank_accounts_customer_name", columnList = "customerName"),
    @Index(name = "idx_bank_accounts_status", columnList = "status"),
    @Index(name = "idx_bank_accounts_created_at", columnList = "createdAt")
})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class BankAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Account number is required")
    @Column(unique = true)
    private String accountNumber;

    @NotNull(message = "Account type is required")
    @Enumerated(EnumType.STRING)
    private AccountType accountType;

    @NotNull(message = "Balance is required")
    @Column(precision = 15, scale = 2)
    private BigDecimal balance = BigDecimal.ZERO;

    @NotNull(message = "Customer name is required")
    private String customerName;

    @Enumerated(EnumType.STRING)
    private AccountStatus status = AccountStatus.ACTIVE;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum AccountType {
        CHECKING, SAVINGS, BUSINESS, CREDIT
    }

    public enum AccountStatus {
        ACTIVE, INACTIVE, SUSPENDED, CLOSED
    }

    // Constructors
    public BankAccount() {}

    public BankAccount(String accountNumber, AccountType accountType, String customerName) {
        this.accountNumber = accountNumber;
        this.accountType = accountType;
        this.customerName = customerName;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public AccountType getAccountType() { return accountType; }
    public void setAccountType(AccountType accountType) { this.accountType = accountType; }

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { 
        this.balance = balance;
        this.updatedAt = LocalDateTime.now();
    }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public AccountStatus getStatus() { return status; }
    public void setStatus(AccountStatus status) { 
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}