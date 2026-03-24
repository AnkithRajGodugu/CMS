package com.example.cms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "bank_accounts", indexes = {
    @Index(name = "idx_bank_accounts_account_number", columnList = "accountNumber"),
    @Index(name = "idx_bank_accounts_customer_name", columnList = "customerName"),
    @Index(name = "idx_bank_accounts_status", columnList = "status"),
    @Index(name = "idx_bank_accounts_created_at", columnList = "createdAt")
})
@SQLDelete(sql = "UPDATE bank_accounts SET deleted = true WHERE id=?")
@SQLRestriction("deleted = false")
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

    @Column(name = "deleted", nullable = false)
    private boolean deleted = false;

    public enum AccountType {
        CHECKING, SAVINGS, BUSINESS, CREDIT
    }

    public enum AccountStatus {
        ACTIVE, INACTIVE, SUSPENDED, CLOSED
    }

    // Constructors
    public BankAccount() {}

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public BankAccount(String accountNumber, AccountType accountType, String customerName, User user) {
        this.accountNumber = accountNumber;
        this.accountType = accountType;
        this.customerName = customerName;
        this.user = user;
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

    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }
}