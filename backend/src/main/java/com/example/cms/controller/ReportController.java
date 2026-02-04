package com.example.cms.controller;

import com.example.cms.entity.Sector;
import com.example.cms.entity.User;
import com.example.cms.repository.CustomerRepository;
import com.example.cms.repository.SectorRepository;
import com.example.cms.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final CustomerRepository customerRepository;
    private final SectorRepository sectorRepository;
    private final UserRepository userRepository;

    public ReportController(CustomerRepository customerRepository,
                            SectorRepository sectorRepository,
                            UserRepository userRepository) {
        this.customerRepository = customerRepository;
        this.sectorRepository = sectorRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        return userRepository.findByUsername(username);
    }

    /**
     * ADMIN → any sector
     * MANAGER → only their sector
     */
    @GetMapping("/customers-this-month")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Long> customersCreatedThisMonth(
            @RequestParam String sectorCode) {

        User user = getCurrentUser();
        Sector sector = sectorRepository.findByCode(sectorCode)
                .orElseThrow(() -> new IllegalArgumentException("Sector not found"));

        // MANAGER safety check
        if (user.getRole() == User.Role.MANAGER &&
                !sector.equals(user.getSector())) {
            return ResponseEntity.status(403).build();
        }

        LocalDateTime start = LocalDateTime.now()
                .withDayOfMonth(1)
                .withHour(0).withMinute(0).withSecond(0).withNano(0);

        LocalDateTime end = start.plusMonths(1);

        long count = customerRepository
                .countBySectorAndCreatedAtBetween(sector, start, end);

        return ResponseEntity.ok(count);
    }
}
