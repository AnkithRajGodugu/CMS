package com.example.cms.controller;

import com.example.cms.entity.BankAccount;
import com.example.cms.entity.Transaction;
import com.example.cms.service.BankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/sectors/banking")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN') or hasRole('USER') or hasRole('MANAGER')")
public class BankingController {

    private final BankingService bankingService;

    // ─── Accounts ─────────────────────────────────────────────────────────────

    @GetMapping("/accounts")
    public ResponseEntity<Page<BankAccount>> getAllAccounts(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(bankingService.getAccounts(pageable));
    }

    @GetMapping("/accounts/{id}")
    public ResponseEntity<BankAccount> getAccountById(@PathVariable Long id) {
        return bankingService.getAccountById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/accounts")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<BankAccount> createAccount(@RequestBody BankAccount account) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bankingService.createAccount(account));
    }

    @PutMapping("/accounts/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<BankAccount> updateAccount(@PathVariable Long id,
                                                     @RequestBody BankAccount accountDetails) {
        return bankingService.updateAccount(id, accountDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ─── Transactions ──────────────────────────────────────────────────────────

    @GetMapping("/transactions")
    public ResponseEntity<Page<Transaction>> getAllTransactions(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(bankingService.getTransactions(pageable));
    }

    @GetMapping("/transactions/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable Long id) {
        return bankingService.getTransactionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/transactions")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Transaction> createTransaction(@RequestBody Transaction transaction) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bankingService.createTransaction(transaction));
    }

    @GetMapping("/transactions/account/{accountNumber}")
    public ResponseEntity<Page<Transaction>> getTransactionsByAccount(
            @PathVariable String accountNumber,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(bankingService.getTransactionsByAccount(accountNumber, pageable));
    }

    // ─── Dashboard ─────────────────────────────────────────────────────────────

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(bankingService.getDashboardStats());
    }

    // ─── Risk Assessment ───────────────────────────────────────────────────────

    @GetMapping("/risk-assessment")
    public ResponseEntity<Map<String, Object>> getRiskAssessment() {
        return ResponseEntity.ok(bankingService.getRiskAssessment());
    }

    // ─── Compliance ────────────────────────────────────────────────────────────

    @GetMapping("/compliance/metrics")
    public ResponseEntity<Map<String, Object>> getComplianceMetrics() {
        return ResponseEntity.ok(bankingService.getComplianceMetrics());
    }
}