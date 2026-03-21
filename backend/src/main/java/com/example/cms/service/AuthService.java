package com.example.cms.service;

import com.example.cms.dto.LoginResponse;
import com.example.cms.entity.Sector;
import com.example.cms.entity.User;
import com.example.cms.exception.SectorNotAssignedException;
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
    private final com.example.cms.repository.OrganizationRepository organizationRepository;

    /* =========================================================
       AUTHENTICATE
    ========================================================== */

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

    /* =========================================================
       LOGIN
    ========================================================== */

    @Transactional
    public LoginResponse login(String username, String password) {

        log.info("Login attempt for user: {}", username);

        Optional<User> userOpt = authenticate(username, password);

        // ❌ INVALID CREDENTIALS
        if (userOpt.isEmpty()) {

            auditService.logAuthentication(
                    null,
                    "LOGIN_FAILED",
                    false,
                    null,
                    "Invalid credentials"
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

        // 🔴 REQUIRED BY TEST: THROW IF NO SECTOR
        if (user.getSector() == null) {

            auditService.logAuthentication(
                    user.getId(),
                    "LOGIN_NO_SECTOR",
                    false,
                    null,
                    "User has no sector assigned"
            );

            throw new SectorNotAssignedException("User has no sector assigned");
        }

        // Sector detection (must NOT execute if sector is null)
        SectorContext sectorContext =
                sectorDetectionService.detectSectorByUsername(username);

        Sector sector = user.getSector();

        // Generate JWT
        String token = jwtUtil.generateToken(
                user.getUsername(),
                user.getRole().toString(),
                sector.getName()
        );

        auditService.logAuthentication(
                user.getId(),
                "LOGIN_SUCCESS",
                true,
                null,
                "User logged in successfully"
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
    }

    /* =========================================================
       USER MANAGEMENT
    ========================================================== */

    public User createUser(
            String username,
            String email,
            String password,
            User.Role role,
            Long sectorId
    ) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email); // ✅ IMPORTANT
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setEnabled(true);

        if (sectorId != null) {
            Sector sector = sectorRepository.findById(sectorId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid sector ID"));
            user.setSector(sector);
        }

        return userRepository.save(user);
    }

    public boolean userExists(String username) {
        return userRepository.findByUsername(username) != null;
    }

    @Transactional
    public User createOrganizationUser(
            String username,
            String email,
            String password,
            String orgName,
            Long sectorId
    ) {
        Sector sector = sectorRepository.findById(sectorId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid sector ID"));

        com.example.cms.entity.Organization org = new com.example.cms.entity.Organization();
        org.setName(orgName);
        org.setSector(sector);
        org.setActive(true);
        org = organizationRepository.save(org);

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(User.Role.ADMIN);
        user.setUserType(com.example.cms.entity.UserType.ORGANIZATION);
        user.setOrganization(org);
        user.setSector(sector);
        user.setEnabled(true);

        return userRepository.save(user);
    }

    @Transactional
    public User updateUserSector(Long userId, Long sectorId) {

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