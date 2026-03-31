package com.example.cms.controller;

import com.example.cms.entity.User;
import com.example.cms.security.JwtUtil;
import com.example.cms.service.AuthService;
import com.example.cms.service.TotpService;
import com.example.cms.repository.UserRepository;
import com.example.cms.dto.LoginRequest;
import com.example.cms.dto.RegisterRequest;
import com.example.cms.dto.RegisterOrgRequest;
import com.example.cms.dto.LoginResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final com.example.cms.service.RateLimitService rateLimitService;
    private final com.example.cms.service.KafkaProducerService kafkaProducerService;
    private final TotpService totpService;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request,
                                   HttpServletRequest httpRequest,
                                   HttpServletResponse httpResponse) {
        String clientIp = getClientIp(httpRequest);
        
        // Check rate limiting
        if (!rateLimitService.tryConsume(clientIp)) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Too many failed attempts. Please try again later.");
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(response);
        }

        try {
            // Authenticate user using enhanced login method
            com.example.cms.dto.LoginResponse loginResponse = authService.login(request.getUsername(), request.getPassword());
            
            if (loginResponse.isSuccess()) {
                // If user has 2FA enabled, don't return the token yet
                Optional<User> userOpt = authService.findByUsername(request.getUsername());
                if (userOpt.isPresent() && userOpt.get().isTotpEnabled()) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("requires2FA", true);
                    response.put("username", request.getUsername());
                    response.put("message", "2FA code required");
                    return ResponseEntity.ok(response);
                }

                // Set secure HttpOnly cookie for refresh token
                Cookie refreshCookie = new Cookie("refresh_token", loginResponse.getRefreshToken());
                refreshCookie.setHttpOnly(true);
                refreshCookie.setSecure(httpRequest.isSecure());
                refreshCookie.setPath("/api/auth/refresh");
                refreshCookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
                httpResponse.addCookie(refreshCookie);

                return ResponseEntity.ok(loginResponse);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(loginResponse);
            }
        } catch (com.example.cms.exception.SectorNotAssignedException e) {
            // User has no sector assigned - return special response
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("requiresSectorSelection", true);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.PRECONDITION_REQUIRED).body(response);
        } catch (BadCredentialsException e) {
            // Increment failed attempts
            incrementFailedAttempts(clientIp);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Login failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            // X-Forwarded-For may contain a comma-separated list; first entry is the real client
            return forwarded.split(",")[0].trim();
        }
        String realIp = request.getHeader("X-Real-IP");
        if (realIp != null && !realIp.isBlank()) {
            return realIp.trim();
        }
        return request.getRemoteAddr();
    }

    private void incrementFailedAttempts(String clientIp) {
        // Redundant with Bucket4j but kept for interface compatibility if needed later
    }

    /**
     * Endpoint to get current user's sector information
     * Requires authentication
     */
    @GetMapping("/sector")
    public ResponseEntity<?> getSectorInfo() {
        try {
            // Get current authentication
            org.springframework.security.core.Authentication authentication = 
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || !authentication.isAuthenticated()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "User not authenticated");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
            String username = authentication.getName();
            Optional<User> userOpt = authService.findByUsername(username);
            
            if (userOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            User user = userOpt.get();
            
            if (user.getSector() == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("requiresSectorSelection", true);
                response.put("message", "User has no sector assigned");
                return ResponseEntity.status(HttpStatus.PRECONDITION_REQUIRED).body(response);
            }
            
            com.example.cms.entity.Sector sector = user.getSector();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("sector", Map.of(
                "id", sector.getId(),
                "code", sector.getCode(),
                "name", sector.getName(),
                "routePath", sector.getRoutePath()
            ));
            
            // Add caching headers for sector data (cache for 5 minutes)
            return ResponseEntity.ok()
                    .cacheControl(org.springframework.http.CacheControl.maxAge(5, java.util.concurrent.TimeUnit.MINUTES))
                    .body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to retrieve sector information: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    /**
     * Endpoint for users to select their sector when not assigned
     * Requires authentication
     */
    @PostMapping("/select-sector")
    public ResponseEntity<?> selectSector(@Valid @RequestBody com.example.cms.dto.SectorSelectionRequest request) {
        try {
            // Get current authentication
            org.springframework.security.core.Authentication authentication = 
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || !authentication.isAuthenticated()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "User not authenticated");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            
            String username = authentication.getName();
            Optional<User> userOpt = authService.findByUsername(username);
            
            if (userOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            User user = userOpt.get();
            
            // Update user's sector
            User updatedUser = authService.updateUserSector(user.getId(), request.getSectorId());
            
            // Publish sector assignment event to Kafka
            com.example.cms.entity.Sector sector = updatedUser.getSector();
            
            Map<String, Object> eventPayload = new HashMap<>();
            eventPayload.put("username", user.getUsername());
            eventPayload.put("sectorId", sector.getId());
            eventPayload.put("sectorCode", sector.getCode());
            eventPayload.put("sectorName", sector.getName());
            
            Map<String, String> eventMetadata = new HashMap<>();
            eventMetadata.put("source", "auth-service");
            eventMetadata.put("action", "sector-selection");
            
            try {
                kafkaProducerService.publishSectorEvent(
                    sector.getCode(),
                    "SECTOR_ASSIGNED",
                    user.getId(),
                    user.getOrganization() != null ? user.getOrganization().getId() : null,
                    eventPayload,
                    eventMetadata
                );
            } catch (Exception e) {
                // Log but don't fail the request if Kafka publish fails
                log.error("Failed to publish sector assignment event for user '{}': {}", username, e.getMessage(), e);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Sector assigned successfully");
            response.put("sector", Map.of(
                "id", sector.getId(),
                "code", sector.getCode(),
                "name", sector.getName(),
                "routePath", sector.getRoutePath()
            ));
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to assign sector: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        Map<String, Object> response = new HashMap<>();

        try {

            // 1️⃣ Check if username exists
            if (authService.userExists(request.getUsername())) {
                response.put("success", false);
                response.put("message", "Username already exists");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            }

            // 2️⃣ Validate role safely
            User.Role role;
            try {
                role = User.Role.valueOf(request.getRole().toUpperCase());
            } catch (IllegalArgumentException e) {
                response.put("success", false);
                response.put("message", "Invalid role. Allowed roles: ADMIN, USER");
                return ResponseEntity.badRequest().body(response);
            }

            // 3️⃣ Create user
            User user = authService.createUser(
                    request.getUsername(),
                    request.getEmail(),
                    request.getPassword(),
                    role,
                    request.getSectorId()
            );

            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("username", user.getUsername());
            userMap.put("role", user.getRole() != null ? user.getRole().toString() : null);
            userMap.put("sectorId", user.getSector() != null ? user.getSector().getId() : null);

            response.put("user", userMap);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            log.error("User registration failed for username '{}': {}", request.getUsername(), e.getMessage(), e);
            response.put("success", false);
            response.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/register/organization")
    public ResponseEntity<Map<String, Object>> registerOrganization(
            @Valid @RequestBody RegisterOrgRequest request
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (authService.userExists(request.getUsername())) {
                response.put("success", false);
                response.put("message", "Username already exists");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            }

            User user = authService.createOrganizationUser(
                    request.getUsername(),
                    request.getEmail(),
                    request.getPassword(),
                    request.getOrganizationName(),
                    request.getSectorId()
            );

            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("username", user.getUsername());
            userMap.put("role", user.getRole() != null ? user.getRole().toString() : null);
            userMap.put("sectorId", user.getSector() != null ? user.getSector().getId() : null);
            userMap.put("organizationId", user.getOrganization() != null ? user.getOrganization().getId() : null);

            response.put("success", true);
            response.put("user", userMap);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            log.error("Organization registration failed for username '{}': {}", request.getUsername(), e.getMessage(), e);
            response.put("success", false);
            response.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    // DTOs moved to com.example.cms.dto package — see LoginRequest.java, RegisterRequest.java, RegisterOrgRequest.java

    // ─── Two-Factor Authentication (TOTP) ──────────────────────────────────────

    /**
     * POST /api/auth/2fa/setup — generates a TOTP secret + QR code URL for the current user.
     * Does NOT enable 2FA yet — the user must first verify a code.
     */
    @PostMapping("/2fa/setup")
    public ResponseEntity<?> setup2FA() {
        try {
            Authentication authentication = org.springframework.security.core.context.SecurityContextHolder
                    .getContext().getAuthentication();
            String username = authentication.getName();

            Optional<User> userOpt = authService.findByUsername(username);
            if (userOpt.isEmpty()) return ResponseEntity.notFound().build();

            String secret = totpService.generateSecret();
            User user = userOpt.get();
            user.setTotpSecret(secret);
            userRepository.save(user);

            String qrImageUrl = totpService.buildQrImageUrl(username, secret, "CMS Platform");

            return ResponseEntity.ok(Map.of(
                "success", true,
                "secret", secret,
                "qrCodeUrl", qrImageUrl
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * POST /api/auth/2fa/enable — verifies a TOTP code and enables 2FA for the account.
     */
    @PostMapping("/2fa/enable")
    public ResponseEntity<?> enable2FA(@RequestBody Map<String, Object> body) {
        try {
            Authentication authentication = org.springframework.security.core.context.SecurityContextHolder
                    .getContext().getAuthentication();
            Optional<User> userOpt = authService.findByUsername(authentication.getName());
            if (userOpt.isEmpty()) return ResponseEntity.notFound().build();

            User user = userOpt.get();
            int code = Integer.parseInt(body.get("code").toString());

            if (user.getTotpSecret() == null || !totpService.verify(user.getTotpSecret(), code)) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid 2FA code."));
            }

            user.setTotpEnabled(true);
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("success", true, "message", "2FA enabled successfully."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * POST /api/auth/2fa/authenticate — called after login when requires2FA=true.
     * Verifies the TOTP code and returns the JWT access token.
     */
    @PostMapping("/2fa/authenticate")
    public ResponseEntity<?> authenticate2FA(@RequestBody Map<String, String> body,
                                              HttpServletResponse httpResponse) {
        try {
            String username = body.get("username");
            String codeStr = body.get("code");
            if (username == null || codeStr == null) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "username and code required"));
            }

            Optional<User> userOpt = authService.findByUsername(username);
            if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", "User not found"));

            User user = userOpt.get();
            int code = Integer.parseInt(codeStr);

            if (!user.isTotpEnabled() || user.getTotpSecret() == null || !totpService.verify(user.getTotpSecret(), code)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Invalid 2FA code."));
            }

            String sectorName = user.getSector() != null ? user.getSector().getName() : "NONE";
            String token = jwtUtil.generateToken(user.getUsername(), user.getRole().toString(), sectorName);
            String refreshToken = jwtUtil.generateRefreshToken(user.getUsername());

            Cookie refreshCookie = new Cookie("refresh_token", refreshToken);
            refreshCookie.setHttpOnly(true);
            refreshCookie.setPath("/api/auth/refresh");
            refreshCookie.setMaxAge(7 * 24 * 60 * 60);
            httpResponse.addCookie(refreshCookie);

            LoginResponse.SectorInfo sectorInfo = null;
            if (user.getSector() != null) {
                sectorInfo = LoginResponse.SectorInfo.builder()
                        .id(user.getSector().getId())
                        .code(user.getSector().getCode())
                        .name(user.getSector().getName())
                        .routePath(user.getSector().getRoutePath())
                        .build();
            }

            LoginResponse loginResponse = LoginResponse.builder()
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

            return ResponseEntity.ok(loginResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * POST /api/auth/2fa/disable — disables 2FA for the current user (requires valid code).
     */
    @PostMapping("/2fa/disable")
    public ResponseEntity<?> disable2FA(@RequestBody Map<String, Object> body) {
        try {
            Authentication authentication = org.springframework.security.core.context.SecurityContextHolder
                    .getContext().getAuthentication();
            Optional<User> userOpt = authService.findByUsername(authentication.getName());
            if (userOpt.isEmpty()) return ResponseEntity.notFound().build();

            User user = userOpt.get();
            int code = Integer.parseInt(body.get("code").toString());

            if (!totpService.verify(user.getTotpSecret(), code)) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid 2FA code."));
            }

            user.setTotpEnabled(false);
            // user.setTotpSecret(null); // Keep the secret for persistent toggle
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("success", true, "message", "2FA disabled."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // ─── Forgot Password & Email Verification ────────────────────────────────

    @GetMapping("/verify-email")
    public ResponseEntity<Map<String, Object>> verifyEmail(@RequestParam String token) {
        boolean success = authService.verifyEmail(token);
        if (success) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Email successfully verified. You can now log in."));
        } else {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid or expired verification token."));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email is required"));
        }

        authService.createPasswordResetToken(email);

        // Always return success to prevent user enumeration
        return ResponseEntity.ok(Map.of("message", "If that email is registered, a reset link has been sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");

        if (token == null || token.isBlank() || newPassword == null || newPassword.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Token and new password are required."));
        }

        boolean success = authService.resetPassword(token, newPassword);
        if (success) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Password successfully reset."));
        } else {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid or expired reset token."));
        }
    }

    /**
     * GET /api/auth/validate-reset-token?token=... — pre-validates a password-reset token.
     * The frontend calls this on page load so users get an immediate error
     * instead of discovering token expiry AFTER they submit a new password.
     */
    @GetMapping("/validate-reset-token")
    public ResponseEntity<Map<String, Object>> validateResetToken(@RequestParam String token) {
        if (token == null || token.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                "valid", false,
                "message", "Token is required."
            ));
        }
        boolean valid = authService.isResetTokenValid(token);
        if (valid) {
            return ResponseEntity.ok(Map.of(
                "valid", true,
                "message", "Token is valid."
            ));
        } else {
            return ResponseEntity.ok(Map.of(
                "valid", false,
                "message", "This password reset link has expired or is invalid. Please request a new one."
            ));
        }
    }

    // ─── Refresh Token ────────────────────────────────────────────────────────

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@CookieValue(name = "refresh_token", required = false) String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Refresh token missing"));
        }

        try {
            if (!jwtUtil.validateRefreshToken(refreshToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid or expired refresh token"));
            }

            String username = jwtUtil.getUsernameFromToken(refreshToken);
            Optional<User> userOpt = authService.findByUsername(username);

            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not found"));
            }

            User user = userOpt.get();
            String sectorName = user.getSector() != null ? user.getSector().getName() : "NONE";
            String newAccessToken = jwtUtil.generateToken(user.getUsername(), user.getRole().toString(), sectorName);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "token", newAccessToken
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid refresh token"));
        }
    }
}