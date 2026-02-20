package com.example.cms.service;

import com.example.cms.dto.LoginResponse;
import com.example.cms.entity.Sector;
import com.example.cms.entity.User;
import com.example.cms.model.SectorContext;
import com.example.cms.repository.SectorRepository;
import com.example.cms.repository.UserRepository;
import com.example.cms.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SectorDetectionService sectorDetectionService;
    private final SectorRepository sectorRepository;
    private final JwtUtil jwtUtil;
    private final AuditService auditService;

    public Optional<User> authenticate(String username, String password) {
        User user = userRepository.findByUsername(username);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return Optional.of(user);
        }
        return Optional.empty();
    }

    public Optional<User> findByUsername(String username) {
        User user = userRepository.findByUsername(username);
        return user != null ? Optional.of(user) : Optional.empty();
    }

    /**
     * Safe login method - NEVER throws exception
     */
    @Transactional
    public LoginResponse login(String username, String password) {

        log.info("Login attempt for user: {}", username);

        try {
            // Authenticate user
            Optional<User> userOpt = authenticate(username, password);

            if (userOpt.isEmpty()) {

                log.warn("Authentication failed for user: {}", username);

                auditService.logAuthentication(
                        null,
                        "LOGIN_FAILED",
                        false,
                        null,
                        "Invalid credentials for username: " + username
                );

                return LoginResponse.builder()
                        .success(false)
                        .message("Invalid credentials")
                        .build();
            }

            User user = userOpt.get();

            // Update last login
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);

            // Check sector assignment
            if (user.getSector() == null) {

                log.warn("User {} has no sector assigned", username);

                auditService.logAuthentication(
                        user.getId(),
                        "LOGIN_NO_SECTOR",
                        false,
                        null,
                        "User has no sector assigned"
                );

                return LoginResponse.builder()
                        .success(false)
                        .message("User has no sector assigned. Please contact administrator.")
                        .build();
            }

            // Optional: detect sector (safe execution)
            try {
                SectorContext sectorContext =
                        sectorDetectionService.detectSectorByUsername(username);
            } catch (Exception e) {
                log.warn("Sector detection failed: {}", e.getMessage());
                // Continue safely
            }

            Sector sector = user.getSector();

            // Generate JWT
            String token = jwtUtil.generateToken(
                    user.getUsername(),
                    user.getRole().toString(),
                    sector.getName()
            );

            log.info("Login successful for user: {} in sector: {}",
                    username, sector.getCode());

            auditService.logAuthentication(
                    user.getId(),
                    "LOGIN_SUCCESS",
                    true,
                    null,
                    "User logged in successfully to sector: " + sector.getCode()
            );

            return LoginResponse.builder()
                    .success(true)
                    .token(token)
                    .user(LoginResponse.UserInfo.builder()
                            .id(user.getId())
                            .username(user.getUsername())
                            .email(user.getEmail())
                            .role(user.getRole().toString())
                            .userType(user.getUserType().toString())
                            .build())
                    .sector(LoginResponse.SectorInfo.builder()
                            .id(sector.getId())
                            .code(sector.getCode())
                            .name(sector.getName())
                            .routePath(sector.getRoutePath())
                            .build())
                    .build();

        } catch (Exception e) {

            log.error("Unexpected error during login", e);

            return LoginResponse.builder()
                    .success(false)
                    .message("Internal error during login")
                    .build();
        }
    }

    public User createUser(String username,
                           String password,
                           User.Role role,
                           Long sectorId) {

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);

        if (sectorId != null) {
            sectorRepository.findById(sectorId)
                    .ifPresent(user::setSector);
        }

        return userRepository.save(user);
    }

    public boolean userExists(String username) {
        return userRepository.findByUsername(username) != null;
    }

    @Transactional
    public User updateUserSector(Long userId, Long sectorId) {

        log.info("Updating sector for user ID: {} to sector ID: {}",
                userId, sectorId);

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        Sector sector = sectorRepository.findById(sectorId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Sector not found"));

        user.setSector(sector);

        User updatedUser = userRepository.save(user);

        auditService.logAction(
                userId,
                sectorId,
                null,
                "SECTOR_ASSIGNED",
                "USER",
                userId.toString(),
                null,
                null
        );

        return updatedUser;
    }
}