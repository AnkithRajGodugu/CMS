// New SectorController.java (CRUD for sectors, admin only - but enforced via role in code for simplicity)
package com.example.cms.controller;

import com.example.cms.entity.Sector;
import com.example.cms.entity.User;
import com.example.cms.repository.UserRepository;
import com.example.cms.service.SectorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/sectors")
public class SectorController {

    @Autowired
    private SectorService sectorService;

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

    @PostMapping
    public ResponseEntity<Sector> createSector(@Valid @RequestBody Sector sector) {
        User currentUser = getCurrentUser();
        if (currentUser == null || currentUser.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(sectorService.createSector(sector));
    }

    @GetMapping
    public ResponseEntity<List<Sector>> getAllSectors() {
        User currentUser = getCurrentUser();
        if (currentUser == null || currentUser.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<Sector> sectors = sectorService.getAllSectors();
        return sectors.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(sectors);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sector> getSectorById(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        if (currentUser == null || currentUser.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return sectorService.getSectorById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Sector> updateSector(@PathVariable Long id, @Valid @RequestBody Sector sectorDetails) {
        User currentUser = getCurrentUser();
        if (currentUser == null || currentUser.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return sectorService.updateSector(id, sectorDetails)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSector(@PathVariable Long id) {
        User currentUser = getCurrentUser();
        if (currentUser == null || currentUser.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return sectorService.deleteSector(id)
                ? ResponseEntity.ok().build()
                : ResponseEntity.notFound().build();
    }
}