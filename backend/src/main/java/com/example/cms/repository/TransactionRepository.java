package com.example.cms.repository;

import com.example.cms.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    Optional<Transaction> findByTransactionId(String transactionId);
    
    List<Transaction> findByAccountNumber(String accountNumber);
    
    List<Transaction> findByStatus(Transaction.TransactionStatus status);
    
    List<Transaction> findByType(Transaction.TransactionType type);
    
    // Optimized query with pagination for transaction history
    @Query("SELECT t FROM Transaction t " +
           "WHERE t.accountNumber = :accountNumber " +
           "ORDER BY t.createdAt DESC")
    Page<Transaction> findByAccountNumberPaginated(@Param("accountNumber") String accountNumber, Pageable pageable);
    
    // Optimized query for account transactions with status filter
    @Query("SELECT t FROM Transaction t " +
           "WHERE t.accountNumber = :accountNumber " +
           "AND t.status = :status " +
           "ORDER BY t.createdAt DESC")
    Page<Transaction> findByAccountNumberAndStatus(
        @Param("accountNumber") String accountNumber,
        @Param("status") Transaction.TransactionStatus status,
        Pageable pageable);
    
    // Optimized date range query with pagination
    @Query("SELECT t FROM Transaction t " +
           "WHERE t.createdAt BETWEEN :startDate AND :endDate " +
           "ORDER BY t.createdAt DESC")
    Page<Transaction> findByDateRangePaginated(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        Pageable pageable);
    
    // Optimized query for recent transactions
    @Query("SELECT t FROM Transaction t " +
           "WHERE t.createdAt >= :since " +
           "ORDER BY t.createdAt DESC")
    List<Transaction> findRecentTransactions(@Param("since") LocalDateTime since);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.status = 'PENDING'")
    Long countPendingTransactions();
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.status = 'FAILED'")
    Long countFailedTransactions();
    
    @Query("SELECT SUM(t.amount) FROM Transaction t " +
           "WHERE t.createdAt >= :startDate AND t.status = 'COMPLETED'")
    BigDecimal getTotalVolumeFromDate(@Param("startDate") LocalDateTime startDate);
    
    // Performance metric queries
    @Query("SELECT COUNT(t) FROM Transaction t " +
           "WHERE t.accountNumber = :accountNumber " +
           "AND t.status = :status")
    long countByAccountNumberAndStatus(
        @Param("accountNumber") String accountNumber,
        @Param("status") Transaction.TransactionStatus status);
}