    package com.example.cms.repository;

    import com.example.cms.entity.BankAccount;
    import org.springframework.data.domain.Page;
    import org.springframework.data.domain.Pageable;
    import org.springframework.data.jpa.repository.JpaRepository;
    import org.springframework.data.jpa.repository.Query;
    import org.springframework.data.repository.query.Param;
    import org.springframework.stereotype.Repository;

    import java.math.BigDecimal;
    import java.util.List;
    import java.util.Optional;

    @Repository
    public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {

        Optional<BankAccount> findByAccountNumber(String accountNumber);

        List<BankAccount> findByCustomerNameContainingIgnoreCase(String customerName);

        List<BankAccount> findByAccountType(BankAccount.AccountType accountType);

        List<BankAccount> findByStatus(BankAccount.AccountStatus status);

        // Paginated query for large result sets
        @Query("SELECT b FROM BankAccount b " +
               "WHERE b.status = :status " +
               "ORDER BY b.createdAt DESC")
        Page<BankAccount> findByStatusPaginated(
            @Param("status") BankAccount.AccountStatus status,
            Pageable pageable);

        // Optimized search query with pagination
        @Query("SELECT b FROM BankAccount b " +
               "WHERE LOWER(b.customerName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
               "OR b.accountNumber LIKE CONCAT('%', :searchTerm, '%') " +
               "ORDER BY b.createdAt DESC")
        Page<BankAccount> searchAccounts(@Param("searchTerm") String searchTerm, Pageable pageable);

        // Query for active accounts by type
        @Query("SELECT b FROM BankAccount b " +
               "WHERE b.accountType = :accountType " +
               "AND b.status = 'ACTIVE' " +
               "ORDER BY b.balance DESC")
        List<BankAccount> findActiveByAccountType(@Param("accountType") BankAccount.AccountType accountType);

        @Query("SELECT COUNT(b) FROM BankAccount b WHERE b.status = 'ACTIVE'")
        Long countActiveAccounts();

        @Query("SELECT SUM(b.balance) FROM BankAccount b WHERE b.status = 'ACTIVE'")
        BigDecimal getTotalDeposits();

        // Performance metric queries
        @Query("SELECT COUNT(b) FROM BankAccount b " +
               "WHERE b.accountType = :accountType AND b.status = 'ACTIVE'")
        long countActiveByAccountType(@Param("accountType") BankAccount.AccountType accountType);

        @Query("SELECT AVG(b.balance) FROM BankAccount b WHERE b.status = 'ACTIVE'")
        BigDecimal getAverageBalance();
    }