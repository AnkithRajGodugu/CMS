package com.example.cms.controller;

import com.example.cms.entity.BankAccount;
import com.example.cms.entity.Transaction;
import com.example.cms.entity.User;
import com.example.cms.service.BankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sectors/banking")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN') or hasRole('USER') or hasRole('MANAGER')")
public class BankingController {

    private final BankingService bankingService;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            return null;
        }
        Object principal = auth.getPrincipal();
        if (principal instanceof com.example.cms.security.CustomUserDetails customUserDetails) {
            return customUserDetails.getUser();
        }
        return null;
    }

    // ─── User-facing: My Dashboard & Accounts ─────────────────────────────────

    @GetMapping("/my-dashboard")
    public ResponseEntity<Map<String, Object>> getMyDashboard() {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.ok(bankingService.getUserDashboardStats(user));
    }

    @GetMapping("/my-accounts")
    public ResponseEntity<List<BankAccount>> getMyAccounts() {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.ok(bankingService.getUserAccounts(user));
    }

    // ─── User-facing: My Transactions ─────────────────────────────────────────

    @GetMapping("/my-transactions")
    public ResponseEntity<Page<Transaction>> getMyTransactions(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(bankingService.getUserTransactions(user, pageable));
    }

    // ─── User-facing: My Statements ───────────────────────────────────────────

    @GetMapping("/my-statements")
    public ResponseEntity<List<Transaction>> getMyStatements(
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now().minusDays(30).toString()}")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(defaultValue = "#{T(java.time.LocalDate).now().toString()}")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.ok(bankingService.getUserStatements(user, from, to));
    }

    // ─── User-facing: Transfer ────────────────────────────────────────────────

    @PostMapping("/my-transfer")
    public ResponseEntity<Map<String, Object>> doTransfer(@RequestBody Map<String, Object> body) {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        try {
            String from   = (String) body.get("fromAccount");
            String to     = (String) body.get("toAccount");
            BigDecimal amt = new BigDecimal(body.get("amount").toString());
            String desc   = (String) body.getOrDefault("description", "Transfer");

            Map<String, Object> result = bankingService.transferBetweenAccounts(from, to, amt, desc, user);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        }
    }

    // ─── Admin: Accounts ──────────────────────────────────────────────────────

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

    // ─── Admin: Transactions ──────────────────────────────────────────────────

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

    // ─── Admin: Dashboard ─────────────────────────────────────────────────────

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(bankingService.getDashboardStats());
    }

    // ─── Admin: Risk Assessment ───────────────────────────────────────────────

    @GetMapping("/risk-assessment")
    public ResponseEntity<Map<String, Object>> getRiskAssessment() {
        return ResponseEntity.ok(bankingService.getRiskAssessment());
    }

    // ─── Admin: Compliance ────────────────────────────────────────────────────

    @GetMapping("/compliance/metrics")
    public ResponseEntity<Map<String, Object>> getComplianceMetrics() {
        return ResponseEntity.ok(bankingService.getComplianceMetrics());
    }
}