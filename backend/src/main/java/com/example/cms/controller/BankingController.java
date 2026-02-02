package com.example.cms.controller;

import com.example.cms.entity.BankAccount;
import com.example.cms.entity.Transaction;
import com.example.cms.repository.BankAccountRepository;
import com.example.cms.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sectors/banking")
@PreAuthorize("hasRole('ADMIN') or hasRole('banking')")
public class BankingController {

    @Autowired
    private BankAccountRepository bankAccountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    // Account Management Endpoints
    @GetMapping("/accounts")
    public ResponseEntity<List<BankAccount>> getAllAccounts() {
        List<BankAccount> accounts = bankAccountRepository.findAll();
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/accounts/{id}")
    public ResponseEntity<BankAccount> getAccountById(@PathVariable Long id) {
        return bankAccountRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/accounts")
    public ResponseEntity<BankAccount> createAccount(@RequestBody BankAccount account) {
        BankAccount savedAccount = bankAccountRepository.save(account);
        return ResponseEntity.ok(savedAccount);
    }

    @PutMapping("/accounts/{id}")
    public ResponseEntity<BankAccount> updateAccount(@PathVariable Long id, @RequestBody BankAccount accountDetails) {
        return bankAccountRepository.findById(id)
                .map(account -> {
                    account.setCustomerName(accountDetails.getCustomerName());
                    account.setBalance(accountDetails.getBalance());
                    account.setStatus(accountDetails.getStatus());
                    return ResponseEntity.ok(bankAccountRepository.save(account));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Transaction Management Endpoints
    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        List<Transaction> transactions = transactionRepository.findAll();
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/transactions/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id) {
        return transactionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/transactions")
    public ResponseEntity<Transaction> createTransaction(@RequestBody Transaction transaction) {
        Transaction savedTransaction = transactionRepository.save(transaction);
        return ResponseEntity.ok(savedTransaction);
    }

    @GetMapping("/transactions/account/{accountNumber}")
    public ResponseEntity<List<Transaction>> getTransactionsByAccount(@PathVariable String accountNumber) {
        List<Transaction> transactions = transactionRepository.findByAccountNumber(accountNumber);
        return ResponseEntity.ok(transactions);
    }

    // Dashboard Statistics
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Account statistics
        Long activeAccounts = bankAccountRepository.countActiveAccounts();
        BigDecimal totalDeposits = bankAccountRepository.getTotalDeposits();
        
        // Transaction statistics
        Long pendingTransactions = transactionRepository.countPendingTransactions();
        Long failedTransactions = transactionRepository.countFailedTransactions();
        
        LocalDateTime todayStart = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        BigDecimal todayVolume = transactionRepository.getTotalVolumeFromDate(todayStart);
        
        stats.put("activeAccounts", activeAccounts != null ? activeAccounts : 0);
        stats.put("totalDeposits", totalDeposits != null ? totalDeposits : BigDecimal.ZERO);
        stats.put("pendingTransactions", pendingTransactions != null ? pendingTransactions : 0);
        stats.put("failedTransactions", failedTransactions != null ? failedTransactions : 0);
        stats.put("todayVolume", todayVolume != null ? todayVolume : BigDecimal.ZERO);
        
        return ResponseEntity.ok(stats);
    }

    // Risk Assessment Endpoints
    @GetMapping("/risk-assessment")
    public ResponseEntity<Map<String, Object>> getRiskAssessment() {
        Map<String, Object> riskData = new HashMap<>();
        
        // Sample risk data - in real implementation, this would be calculated
        riskData.put("lowRisk", 156);
        riskData.put("mediumRisk", 47);
        riskData.put("highRisk", 12);
        
        return ResponseEntity.ok(riskData);
    }

    // Compliance Tools Endpoints
    @GetMapping("/compliance/metrics")
    public ResponseEntity<Map<String, Object>> getComplianceMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        
        // Sample compliance data
        metrics.put("amlCompliance", 98);
        metrics.put("kycVerification", 95);
        metrics.put("riskAssessment", 87);
        metrics.put("regulatoryReporting", 92);
        
        return ResponseEntity.ok(metrics);
    }
}