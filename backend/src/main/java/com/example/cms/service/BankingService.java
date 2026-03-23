package com.example.cms.service;

import com.example.cms.entity.BankAccount;
import com.example.cms.entity.Transaction;
import com.example.cms.repository.BankAccountRepository;
import com.example.cms.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

/**
 * Service layer for all Banking sector business logic.
 * Controllers delegate to this class; no repository access in controllers.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BankingService {

    private final BankAccountRepository bankAccountRepository;
    private final TransactionRepository transactionRepository;
    private final NotificationService notificationService;

    // ─── Accounts ─────────────────────────────────────────────────────────────

    public Page<BankAccount> getAccounts(Pageable pageable) {
        return bankAccountRepository.findAll(pageable);
    }

    public Optional<BankAccount> getAccountById(Long id) {
        return bankAccountRepository.findById(id);
    }

    @Transactional
    public BankAccount createAccount(BankAccount account) {
        BankAccount saved = bankAccountRepository.save(account);
        notificationService.sendSectorNotification(
                "BANKING",
                "ACCOUNT_CREATED",
                "New bank account created: " + saved.getAccountNumber(),
                Map.of("id", saved.getId(), "accountNumber", saved.getAccountNumber())
        );
        return saved;
    }

    @Transactional
    public Optional<BankAccount> updateAccount(Long id, BankAccount details) {
        return bankAccountRepository.findById(id).map(account -> {
            account.setCustomerName(details.getCustomerName());
            account.setBalance(details.getBalance());
            account.setStatus(details.getStatus());
            BankAccount saved = bankAccountRepository.save(account);
            notificationService.sendSectorNotification(
                    "BANKING",
                    "ACCOUNT_UPDATED",
                    "Account " + saved.getAccountNumber() + " updated",
                    Map.of("id", saved.getId(), "status", saved.getStatus())
            );
            return saved;
        });
    }

    // ─── Transactions ──────────────────────────────────────────────────────────

    public Page<Transaction> getTransactions(Pageable pageable) {
        return transactionRepository.findAll(pageable);
    }

    public Optional<Transaction> getTransactionById(Long id) {
        return transactionRepository.findById(id);
    }

    public Page<Transaction> getTransactionsByAccount(String accountNumber, Pageable pageable) {
        return transactionRepository.findByAccountNumberPaginated(accountNumber, pageable);
    }

    @Transactional
    public Transaction createTransaction(Transaction transaction) {
        Transaction saved = transactionRepository.save(transaction);
        notificationService.sendSectorNotification(
                "BANKING",
                "TRANSACTION_CREATED",
                "New transaction: " + saved.getType() + " of $" + saved.getAmount(),
                Map.of("id", saved.getId(), "amount", saved.getAmount(), "type", saved.getType())
        );
        return saved;
    }

    // ─── Dashboard stats ───────────────────────────────────────────────────────

    public Map<String, Object> getDashboardStats() {
        Long activeAccounts    = bankAccountRepository.countActiveAccounts();
        BigDecimal totalDeposits = bankAccountRepository.getTotalDeposits();
        Long pendingTx         = transactionRepository.countPendingTransactions();
        Long failedTx          = transactionRepository.countFailedTransactions();
        LocalDateTime todayStart = LocalDateTime.now().toLocalDate().atStartOfDay();
        BigDecimal todayVolume = transactionRepository.getTotalVolumeFromDate(todayStart);

        return Map.of(
                "activeAccounts",      activeAccounts  != null ? activeAccounts  : 0L,
                "totalDeposits",       totalDeposits   != null ? totalDeposits   : BigDecimal.ZERO,
                "pendingTransactions", pendingTx       != null ? pendingTx       : 0L,
                "failedTransactions",  failedTx        != null ? failedTx        : 0L,
                "todayVolume",         todayVolume     != null ? todayVolume     : BigDecimal.ZERO
        );
    }

    // ─── Risk Assessment (real queries) ───────────────────────────────────────

    public Map<String, Object> getRiskAssessment() {
        // TODO Phase 2: derive from real transaction / account signals
        // Counts are derived from account status distribution as a proxy for now
        long total  = bankAccountRepository.count();
        long active = Optional.ofNullable(bankAccountRepository.countActiveAccounts()).orElse(0L);
        long inactive = total - active;

        return Map.of(
                "lowRisk",    active  > 0 ? (long) (active  * 0.75) : 0L,
                "mediumRisk", active  > 0 ? (long) (active  * 0.20) : 0L,
                "highRisk",   inactive > 0 ? inactive : 0L,
                "total",      total
        );
    }

    // ─── Compliance ───────────────────────────────────────────────────────────

    public Map<String, Object> getComplianceMetrics() {
        // TODO Phase 2: wire to real compliance tracking tables
        return Map.of(
                "amlCompliance",        98,
                "kycVerification",      95,
                "riskAssessment",       87,
                "regulatoryReporting",  92
        );
    }
}
