package com.example.cms.controller;

import com.example.cms.entity.User;
import com.example.cms.security.JwtUtil;
import com.example.cms.service.AuthService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
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
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        String clientIp = getClientIp();
        
        // Check rate limiting
        if (isBlocked(clientIp)) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Too many failed attempts. Please try again later.");
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(response);
        }

        try {
            // Authenticate user using enhanced login method
            com.example.cms.dto.LoginResponse loginResponse = authService.login(request.getUsername(), request.getPassword());
            
            if (loginResponse.isSuccess()) {
                // Reset failed attempts on successful login
                loginAttempts.remove(clientIp);
                lastAttemptTime.remove(clientIp);
                
                return ResponseEntity.ok(loginResponse);
            } else {
                // Increment failed attempts
                incrementFailedAttempts(clientIp);
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
            
            // TODO: Re-enable Kafka event publishing when Kafka is properly configured
            // try {
            //     kafkaProducerService.publishSectorEvent(
            //         sector.getCode(),
            //         "SECTOR_ASSIGNED",
            //         user.getId(),
            //         user.getOrganization() != null ? user.getOrganization().getId() : null,
            //         eventPayload,
            //         eventMetadata
            //     );
            // } catch (Exception e) {
            //     // Log but don't fail the request if Kafka publish fails
            //     System.err.println("Failed to publish sector assignment event: " + e.getMessage());
            // }
            
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
            e.printStackTrace();

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

            response.put("success", true);
            response.put("user", userMap);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
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

    public static class RegisterOrgRequest {
        @NotBlank(message = "Username is required")
        @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
        private String username;

        @NotBlank(message = "Email is required")
        @jakarta.validation.constraints.Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        private String password;

        @NotBlank(message = "Organization name is required")
        private String organizationName;

        @jakarta.validation.constraints.NotNull(message = "Sector is required")
        private Long sectorId;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getOrganizationName() { return organizationName; }
        public void setOrganizationName(String organizationName) { this.organizationName = organizationName; }
        public Long getSectorId() { return sectorId; }
        public void setSectorId(Long sectorId) { this.sectorId = sectorId; }
    }

    public static class RegisterRequest {
        public void setUsername(String username) {
            this.username = username;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public void setSectorId(Long sectorId) {
            this.sectorId = sectorId;
        }

        public String getUsername() {
            return username;
        }

        public String getEmail() {
            return email;
        }

        public String getPassword() {
            return password;
        }

        public String getRole() {
            return role;
        }

        public Long getSectorId() {
            return sectorId;
        }



            @NotBlank(message = "Username is required")
            @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
            private String username;

            @NotBlank(message = "Email is required")
            @jakarta.validation.constraints.Email(message = "Invalid email format")
            private String email;

            @NotBlank(message = "Password is required")
            @Size(min = 8, message = "Password must be at least 8 characters")
            private String password;

            @NotBlank(message = "Role is required")
            private String role;

            @jakarta.validation.constraints.NotNull(message = "Sector is required")
            private Long sectorId;

            // getters + setters
        }

        // getters & setters

}