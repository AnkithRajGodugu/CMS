// New ReportController.java (simple report endpoint)
package com.example.cms.controller;

import com.example.cms.entity.Sector;
import com.example.cms.entity.User;
import com.example.cms.repository.CustomerRepository;
import com.example.cms.repository.SectorRepository;
import com.example.cms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Optional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SectorRepository sectorRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return null;
        }
        String username = ((UserDetails) auth.getPrincipal()).getUsername();
        return userRepository.findByUsername(username);
    }

    @GetMapping("/customers-in-sector-this-month")
    public ResponseEntity<Long> getCustomersInSectorThisMonth(@RequestParam String sectorName) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<Sector> sectorOpt = sectorRepository.findByName(sectorName);
        if (sectorOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Sector sector = sectorOpt.get();

        if (currentUser.getRole() != User.Role.ADMIN &&
                !(currentUser.getRole() == User.Role.MANAGER && sector.equals(currentUser.getSector()))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        LocalDateTime start = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime end = start.plusMonths(1);

        long count = customerRepository.countBySectorAndCreatedAtBetween(sector, start, end);
        return ResponseEntity.ok(count);
    }
}