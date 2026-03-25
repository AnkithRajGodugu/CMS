package com.example.cms.service;

import com.example.cms.entity.BankAccount;
import com.example.cms.entity.Transaction;
import com.example.cms.entity.User;
import com.example.cms.repository.BankAccountRepository;
import com.example.cms.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Service layer for all Banking sector business logic.
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
                "BANKING", "ACCOUNT_CREATED",
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
                    "BANKING", "ACCOUNT_UPDATED",
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
                "BANKING", "TRANSACTION_CREATED",
                "New transaction: " + saved.getType() + " of $" + saved.getAmount(),
                Map.of("id", saved.getId(), "amount", saved.getAmount(), "type", saved.getType())
        );
        return saved;
    }

    // ─── User-Scoped: My Transactions ─────────────────────────────────────────

    /** Returns all transactions across the user's accounts (paginated). */
    public Page<Transaction> getUserTransactions(User user, Pageable pageable) {
        Set<String> accountNumbers = bankAccountRepository.findByUser(user)
                .stream()
                .map(BankAccount::getAccountNumber)
                .collect(Collectors.toSet());

        if (accountNumbers.isEmpty()) {
            return Page.empty(pageable);
        }
        return transactionRepository.findByAccountNumbersIn(accountNumbers, pageable);
    }

    /** Returns transactions filtered by date range for statement view. */
    public List<Transaction> getUserStatements(User user, LocalDate from, LocalDate to) {
        Set<String> accountNumbers = bankAccountRepository.findByUser(user)
                .stream()
                .map(BankAccount::getAccountNumber)
                .collect(Collectors.toSet());

        if (accountNumbers.isEmpty()) {
            return List.of();
        }
        LocalDateTime fromDt = from.atStartOfDay();
        LocalDateTime toDt   = to.plusDays(1).atStartOfDay();
        return transactionRepository.findUserStatements(accountNumbers, fromDt, toDt);
    }

    // ─── User-Scoped: Transfer ────────────────────────────────────────────────

    @Transactional
    public Map<String, Object> transferBetweenAccounts(
            String fromAccountNumber,
            String toAccountNumber,
            BigDecimal amount,
            String description,
            User user) {

        BankAccount from = bankAccountRepository.findByAccountNumber(fromAccountNumber)
                .orElseThrow(() -> new IllegalArgumentException("Source account not found"));
        BankAccount to = bankAccountRepository.findByAccountNumber(toAccountNumber)
                .orElseThrow(() -> new IllegalArgumentException("Destination account not found"));

        if (from.getUser() == null || !from.getUser().getId().equals(user.getId())) {
            throw new SecurityException("You do not own the source account");
        }
        if (to.getUser() == null || !to.getUser().getId().equals(user.getId())) {
            throw new SecurityException("You do not own the destination account");
        }
        if (from.getBalance().compareTo(amount) < 0) {
            throw new IllegalStateException("Insufficient balance in source account");
        }

        from.setBalance(from.getBalance().subtract(amount));
        bankAccountRepository.save(from);

        to.setBalance(to.getBalance().add(amount));
        bankAccountRepository.save(to);

        String ref  = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String desc = (description != null && !description.isBlank()) ? description : "Transfer";

        Transaction debit = new Transaction();
        debit.setTransactionId(ref + "-D");
        debit.setType(Transaction.TransactionType.TRANSFER);
        debit.setAmount(amount);
        debit.setAccountNumber(fromAccountNumber);
        debit.setStatus(Transaction.TransactionStatus.COMPLETED);
        debit.setDescription(desc + " \u2192 " + toAccountNumber);
        debit.setProcessedAt(LocalDateTime.now());
        transactionRepository.save(debit);

        Transaction credit = new Transaction();
        credit.setTransactionId(ref + "-C");
        credit.setType(Transaction.TransactionType.DEPOSIT);
        credit.setAmount(amount);
        credit.setAccountNumber(toAccountNumber);
        credit.setStatus(Transaction.TransactionStatus.COMPLETED);
        credit.setDescription(desc + " \u2190 " + fromAccountNumber);
        credit.setProcessedAt(LocalDateTime.now());
        transactionRepository.save(credit);

        notificationService.sendSectorNotification(
                "BANKING", "TRANSFER_COMPLETED",
                "Transfer of $" + amount + " from " + fromAccountNumber + " to " + toAccountNumber,
                Map.of("ref", ref, "amount", amount)
        );

        return Map.of("success", true, "reference", ref, "amount", amount,
                      "from", fromAccountNumber, "to", toAccountNumber);
    }

    @Transactional
    public Map<String, Object> performExternalTransfer(
            String fromAccountNumber,
            String routingNumber,
            String externalAccountNumber,
            BigDecimal amount,
            String description,
            User user) {

        BankAccount from = bankAccountRepository.findByAccountNumber(fromAccountNumber)
                .orElseThrow(() -> new IllegalArgumentException("Source account not found"));

        if (from.getUser() == null || !from.getUser().getId().equals(user.getId())) {
            throw new SecurityException("You do not own the source account");
        }

        // Validate Routing Number (simple 9-digit check for ABA routing)
        if (routingNumber == null || !routingNumber.matches("\\d{9}")) {
            throw new IllegalArgumentException("Invalid routing number format. Must be 9 digits.");
        }

        // Apply 0.5% fee for external transfers
        BigDecimal fee = amount.multiply(new BigDecimal("0.005"));
        BigDecimal totalDeduction = amount.add(fee);

        if (from.getBalance().compareTo(totalDeduction) < 0) {
            throw new IllegalStateException("Insufficient balance to cover transfer and 0.5% fee");
        }

        from.setBalance(from.getBalance().subtract(totalDeduction));
        bankAccountRepository.save(from);

        String ref  = "EXT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String desc = (description != null && !description.isBlank()) ? description : "External Transfer";

        Transaction debit = new Transaction();
        debit.setTransactionId(ref + "-D");
        debit.setType(Transaction.TransactionType.TRANSFER); // or EXTERNAL_TRANSFER if enum supported
        debit.setAmount(totalDeduction); // we record total deduction (amount + fee)
        debit.setAccountNumber(fromAccountNumber);
        debit.setStatus(Transaction.TransactionStatus.PENDING); // external takes time
        debit.setDescription(desc + " \u2192 Routing: " + routingNumber + " Acct: " + externalAccountNumber + " (Inc. fee $" + String.format("%.2f", fee) + ")");
        debit.setProcessedAt(LocalDateTime.now());
        transactionRepository.save(debit);

        notificationService.sendSectorNotification(
                "BANKING", "TRANSFER_PENDING",
                "External transfer of $" + amount + " initiated from " + fromAccountNumber,
                Map.of("ref", ref, "amount", amount, "fee", fee)
        );

        return Map.of(
            "success", true,
            "reference", ref,
            "amount", amount,
            "fee", fee,
            "totalDeducted", totalDeduction,
            "from", fromAccountNumber,
            "routingNumber", routingNumber,
            "status", "PENDING"
        );
    }

    // ─── Dashboard Stats ───────────────────────────────────────────────────────

    public Map<String, Object> getDashboardStats() {
        Long activeAccounts  = bankAccountRepository.countActiveAccounts();
        BigDecimal totalDeposits = bankAccountRepository.getTotalDeposits();
        Long pendingTx       = transactionRepository.countPendingTransactions();
        Long failedTx        = transactionRepository.countFailedTransactions();
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

    public Map<String, Object> getUserDashboardStats(User user) {
        List<BankAccount> accounts = bankAccountRepository.findByUser(user);
        BigDecimal totalBalance = accounts.stream()
                .map(BankAccount::getBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return Map.of(
                "totalBalance",   totalBalance,
                "accountCount",   (long) accounts.size(),
                "activeAccounts", accounts.stream()
                        .filter(a -> a.getStatus() == BankAccount.AccountStatus.ACTIVE).count()
        );
    }

    public List<BankAccount> getUserAccounts(User user) {
        return bankAccountRepository.findByUser(user);
    }

    // ─── Risk Assessment ───────────────────────────────────────────────────────

    public Map<String, Object> getRiskAssessment() {
        long total    = bankAccountRepository.count();
        long active   = Optional.ofNullable(bankAccountRepository.countActiveAccounts()).orElse(0L);
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
        long total   = bankAccountRepository.count();
        long active  = Optional.ofNullable(bankAccountRepository.countActiveAccounts()).orElse(0L);
        long pending = Optional.ofNullable(transactionRepository.countPendingTransactions()).orElse(0L);
        long failed  = Optional.ofNullable(transactionRepository.countFailedTransactions()).orElse(0L);

        int aml      = total > 0 ? (int) Math.min(100, 90 + (active * 10 / total)) : 90;
        int kyc      = total > 0 ? (int) Math.min(100, 85 + (active * 15 / total)) : 85;
        int risk     = (pending + failed) > 0
                ? (int) Math.max(50, 100 - ((pending + failed) * 5))
                : 95;

        return Map.of(
                "amlCompliance",       aml,
                "kycVerification",     kyc,
                "riskAssessment",      risk,
                "regulatoryReporting", 92
        );
    }
}
