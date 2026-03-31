package com.example.cms.service;

import com.example.cms.dto.LoginResponse;
import com.example.cms.entity.Sector;
import com.example.cms.entity.User;
import com.example.cms.exception.SectorNotAssignedException;
import com.example.cms.model.SectorContext;
import com.example.cms.repository.SectorRepository;
import com.example.cms.repository.UserRepository;
import com.example.cms.security.JwtUtil;
import com.example.cms.util.EncryptionUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import com.example.cms.entity.VerificationToken;
import com.example.cms.repository.VerificationTokenRepository;
import com.example.cms.entity.PasswordResetToken;
import com.example.cms.repository.PasswordResetTokenRepository;

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
    private final MailService mailService;
    private final VerificationTokenRepository verificationTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EncryptionUtil encryptionUtil;

    /* =========================================================
       AUTHENTICATE
    ========================================================== */

    public Optional<User> authenticate(String login, String password) {
        // Try exact username match first (fast path — username column is not encrypted)
        User user = userRepository.findByUsername(login);

        // If no username match and looks like an email, scan in-memory
        // NOTE: We CANNOT use findByEmail(email) because the email column is AES-GCM
        // encrypted with a random IV per write — each ciphertext is unique,
        // so a DB-level equality query will never match plaintext input.
        if (user == null && login.contains("@")) {
            String normalised = login.toLowerCase().trim();
            user = userRepository.findAll().stream()
                    .filter(u -> {
                        try {
                            String decryptedEmail = u.getEmail(); // JPA converter decrypts here
                            return normalised.equals(decryptedEmail);
                        } catch (Exception ignored) {
                            // Email was encrypted with a different key (e.g. old random key)
                            // — skip this user safely
                            return false;
                        }
                    })
                    .findFirst()
                    .orElse(null);
        }

        if (user != null) {
            boolean matches = passwordEncoder.matches(password, user.getPassword());
            log.info("Auth comparison for user {}: input={}, hash={}, match={}", 
                user.getUsername(), password, user.getPassword(), matches);
            if (matches) {
                return Optional.of(user);
            }
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

        if (!user.isEmailVerified()) {
            return LoginResponse.builder()
                    .success(false)
                    .message("Please verify your email address before logging in")
                    .build();
        }

        // Update last login
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        // ADMIN users without a sector can still log in — they manage all sectors
        if (user.getSector() == null && user.getRole() != User.Role.ADMIN) {

            auditService.logAuthentication(
                    user.getId(),
                    "LOGIN_NO_SECTOR",
                    false,
                    null,
                    "User has no sector assigned"
            );

            throw new SectorNotAssignedException("User has no sector assigned");
        }

        Sector sector = user.getSector();
        String sectorName = sector != null ? sector.getName() : "ADMIN";

        // Generate JWT
        String token = jwtUtil.generateToken(
                user.getUsername(),
                user.getRole().toString(),
                sectorName
        );

        String refreshToken = jwtUtil.generateRefreshToken(user.getUsername());

        auditService.logAuthentication(
                user.getId(),
                "LOGIN_SUCCESS",
                true,
                null,
                "User logged in successfully"
        );

        LoginResponse.SectorInfo sectorInfo = null;
        if (sector != null) {
            sectorInfo = LoginResponse.SectorInfo.builder()
                    .id(sector.getId())
                    .code(sector.getCode())
                    .name(sector.getName())
                    .routePath(sector.getRoutePath())
                    .build();
        } else {
            // Admin fallback — redirect to admin dashboard
            sectorInfo = LoginResponse.SectorInfo.builder()
                    .id(0L)
                    .code("ADMIN")
                    .name("Administration")
                    .routePath("/admin")
                    .build();
        }

        return LoginResponse.builder()
                .success(true)
                .token(token)
                .refreshToken(refreshToken)
                .user(LoginResponse.UserInfo.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .role(user.getRole().toString())
                        .userType(user.getUserType() != null ? user.getUserType().toString() : "INDIVIDUAL")
                        .organizationId(user.getOrganization() != null ? user.getOrganization().getId() : null)
                        .totpEnabled(user.isTotpEnabled())
                        .hasTotpSecret(user.getTotpSecret() != null)
                        .build())
                .sector(sectorInfo)
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
        user.setEmailVerified(true); // ✅ AUTO-VERIFY FOR DEV/TESTING

        if (sectorId != null) {
            Sector sector = sectorRepository.findById(sectorId)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid sector ID"));
            user.setSector(sector);
        }

        User savedUser = userRepository.save(user);

        // Try to send verification email — swallow failure so user is always created
        try {
            String token = UUID.randomUUID().toString();
            VerificationToken verificationToken = new VerificationToken(token, savedUser, 24 * 60);
            verificationTokenRepository.save(verificationToken);
            mailService.sendVerificationEmail(savedUser.getEmail(), token);
        } catch (Exception e) {
            log.warn("Failed to send verification email for {}: {} (user was still created)",
                    savedUser.getUsername(), e.getMessage());
        }

        return savedUser;
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
        user.setEmailVerified(true); // ✅ AUTO-VERIFY FOR DEV/TESTING

        User savedUser = userRepository.save(user);

        // Try to send verification email — swallow failure so user is always created
        try {
            String token = UUID.randomUUID().toString();
            VerificationToken verificationToken = new VerificationToken(token, savedUser, 24 * 60);
            verificationTokenRepository.save(verificationToken);
            mailService.sendVerificationEmail(savedUser.getEmail(), token);
        } catch (Exception e) {
            log.warn("Failed to send verification email for {}: {} (user was still created)",
                    savedUser.getUsername(), e.getMessage());
        }

        return savedUser;
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

    /* =========================================================
       EMAIL VERIFICATION & PASSWORD RESET
    ========================================================== */

    @Transactional
    public boolean verifyEmail(String token) {
        Optional<VerificationToken> verificationTokenOpt = verificationTokenRepository.findByToken(token);
        if (verificationTokenOpt.isEmpty()) {
            return false;
        }

        VerificationToken verificationToken = verificationTokenOpt.get();
        if (verificationToken.isExpired()) {
            verificationTokenRepository.delete(verificationToken);
            return false;
        }

        User user = verificationToken.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);
        
        verificationTokenRepository.delete(verificationToken);
        return true;
    }

    @Transactional
    public void verifyUserEmailProgrammatically(String email) {
        try {
            User user = userRepository.findByEmail(email.toLowerCase().trim());
            if (user != null) {
                user.setEmailVerified(true);
                userRepository.save(user);
                log.info("Programmatically verified email for user: {}", email);
            } else {
                log.warn("verifyUserEmailProgrammatically: no user found for email {}", email);
            }
        } catch (Exception e) {
            log.error("Failed to verify email programmatically for {}: {}", email, e.getMessage());
        }
    }

    @Transactional
    public void createPasswordResetToken(String email) {
        // findByEmail() uses a DB-level equality query which CANNOT match AES-GCM
        // encrypted emails (random IV per write = unique ciphertext every time).
        // We must scan in-memory and decrypt at the JPA converter layer instead —
        // exactly the same pattern used in authenticate().
        String normalised = email.toLowerCase().trim();
        User user = userRepository.findAll().stream()
                .filter(u -> {
                    try {
                        String decryptedEmail = u.getEmail(); // JPA converter decrypts here
                        return normalised.equals(decryptedEmail);
                    } catch (Exception ignored) {
                        return false;
                    }
                })
                .findFirst()
                .orElse(null);

        if (user == null) {
            // Fail silently — never reveal whether the email is registered
            log.info("Password reset requested for unknown email (silently ignored)");
            return;
        }

        // Delete any existing token for this user before issuing a new one
        passwordResetTokenRepository.deleteByUser(user);

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(token, user, 60); // 1 hour expiry
        passwordResetTokenRepository.save(resetToken);

        mailService.sendPasswordResetEmail(user.getEmail(), token);
        log.info("Password reset token created for user '{}' (email delivery attempted)", user.getUsername());
    }

    /**
     * Non-destructive check: returns true if the token exists and has not expired.
     * The token is NOT deleted here — only consumed by resetPassword().
     */
    public boolean isResetTokenValid(String token) {
        return passwordResetTokenRepository.findByToken(token)
                .map(t -> !t.isExpired())
                .orElse(false);
    }

    @Transactional
    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> resetTokenOpt = passwordResetTokenRepository.findByToken(token);
        if (resetTokenOpt.isEmpty()) {
            return false;
        }

        PasswordResetToken resetToken = resetTokenOpt.get();
        if (resetToken.isExpired()) {
            passwordResetTokenRepository.delete(resetToken);
            return false;
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        passwordResetTokenRepository.delete(resetToken);
        log.info("Password reset successfully for user '{}'", user.getUsername());
        return true;
    }
}