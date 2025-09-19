package com.example.cms.repository;

import com.example.cms.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    Optional<Transaction> findByTransactionId(String transactionId);
    
    List<Transaction> findByAccountNumber(String accountNumber);
    
    List<Transaction> findByStatus(Transaction.TransactionStatus status);
    
    List<Transaction> findByType(Transaction.TransactionType type);
    
    @Query("SELECT t FROM Transaction t WHERE t.createdAt BETWEEN :startDate AND :endDate")
    List<Transaction> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.status = 'PENDING'")
    Long countPendingTransactions();
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.status = 'FAILED'")
    Long countFailedTransactions();
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.createdAt >= :startDate AND t.status = 'COMPLETED'")
    java.math.BigDecimal getTotalVolumeFromDate(@Param("startDate") LocalDateTime startDate);
}