package com.example.cms.controller;

import com.example.cms.entity.User;
import com.example.cms.security.JwtUtil;
import com.example.cms.service.AuthService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    
    // Simple rate limiting (in production, use Redis or proper rate limiting)
    private final Map<String, AtomicInteger> loginAttempts = new ConcurrentHashMap<>();
    private final Map<String, Long> lastAttemptTime = new ConcurrentHashMap<>();
    private static final int MAX_ATTEMPTS = 5;
    private static final long LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        String clientIp = getClientIp();
        
        // Check rate limiting
        if (isBlocked(clientIp)) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Too many failed attempts. Please try again later.");
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(response);
        }

        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            // Get user details
            Optional<User> userOpt = authService.findByUsername(request.getUsername());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                
                // Generate JWT token
                String token = jwtUtil.generateToken(
                    user.getUsername(),
                    user.getRole().toString(),
                    user.getSector() != null ? user.getSector().getName() : null
                );

                // Reset failed attempts on successful login
                loginAttempts.remove(clientIp);
                lastAttemptTime.remove(clientIp);

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("token", token);
                response.put("user", Map.of(
                    "id", user.getId(),
                    "username", user.getUsername(),
                    "role", user.getRole().toString(),
                    "sector", user.getSector() != null ? Map.of(
                        "id", user.getSector().getId(),
                        "name", user.getSector().getName()
                    ) : null
                ));
                return ResponseEntity.ok(response);
            }
        } catch (BadCredentialsException e) {
            // Increment failed attempts
            incrementFailedAttempts(clientIp);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "Invalid credentials");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    private String getClientIp() {
        // In production, get real client IP from headers
        return "127.0.0.1"; // Simplified for demo
    }

    private boolean isBlocked(String clientIp) {
        AtomicInteger attempts = loginAttempts.get(clientIp);
        Long lastAttempt = lastAttemptTime.get(clientIp);
        
        if (attempts != null && attempts.get() >= MAX_ATTEMPTS) {
            if (lastAttempt != null && (System.currentTimeMillis() - lastAttempt) < LOCKOUT_TIME) {
                return true;
            } else {
                // Reset after lockout period
                loginAttempts.remove(clientIp);
                lastAttemptTime.remove(clientIp);
            }
        }
        return false;
    }

    private void incrementFailedAttempts(String clientIp) {
        loginAttempts.computeIfAbsent(clientIp, k -> new AtomicInteger(0)).incrementAndGet();
        lastAttemptTime.put(clientIp, System.currentTimeMillis());
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterRequest request) {
        if (authService.userExists(request.getUsername())) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Username already exists");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            User.Role role = User.Role.valueOf(request.getRole().toUpperCase());
            User user = authService.createUser(request.getUsername(), request.getPassword(), role, request.getSectorId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User created successfully");
            response.put("user", Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "role", user.getRole().toString()
            ));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // DTOs with validation
    public static class LoginRequest {
        @NotBlank(message = "Username is required")
        @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
        private String username;
        
        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        @NotBlank(message = "Username is required")
        @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
        private String username;
        
        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        private String password;
        
        @NotBlank(message = "Role is required")
        private String role;
        
        private Long sectorId;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public Long getSectorId() { return sectorId; }
        public void setSectorId(Long sectorId) { this.sectorId = sectorId; }
    }
}