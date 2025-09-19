package com.example.cms.repository;

import com.example.cms.entity.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {
    
    Optional<BankAccount> findByAccountNumber(String accountNumber);
    
    List<BankAccount> findByCustomerNameContainingIgnoreCase(String customerName);
    
    List<BankAccount> findByAccountType(BankAccount.AccountType accountType);
    
    List<BankAccount> findByStatus(BankAccount.AccountStatus status);
    
    @Query("SELECT COUNT(b) FROM BankAccount b WHERE b.status = 'ACTIVE'")
    Long countActiveAccounts();
    
    @Query("SELECT SUM(b.balance) FROM BankAccount b WHERE b.status = 'ACTIVE'")
    java.math.BigDecimal getTotalDeposits();
}