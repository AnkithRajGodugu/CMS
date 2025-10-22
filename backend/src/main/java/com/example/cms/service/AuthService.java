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
     * Enhanced login method that returns sector information along with JWT token
     * 
     * @param username The username
     * @param password The password
     * @return LoginResponse containing token, user info, and sector info
     */
    @Transactional
    public LoginResponse login(String username, String password) {
        log.info("Login attempt for user: {}", username);
        
        // Authenticate user
        Optional<User> userOpt = authenticate(username, password);
        if (userOpt.isEmpty()) {
            log.warn("Authentication failed for user: {}", username);
            
            // Log failed authentication attempt
            auditService.logAuthentication(null, "LOGIN_FAILED", false, 
                    null, "Invalid credentials for username: " + username);
            
            return LoginResponse.builder()
                    .success(false)
                    .message("Invalid credentials")
                    .build();
        }
        
        User user = userOpt.get();
        
        // Update last login timestamp
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        
        // Check if user has a sector assigned
        if (user.getSector() == null) {
            log.warn("User {} has no sector assigned", username);
            
            // Log sector not assigned
            auditService.logAuthentication(user.getId(), "LOGIN_NO_SECTOR", false, 
                    null, "User has no sector assigned");
            
            throw new SectorNotAssignedException("User has no sector assigned. Please select a sector.");
        }
        
        // Detect sector using SectorDetectionService
        SectorContext sectorContext = sectorDetectionService.detectSectorByUsername(username);
        Sector sector = user.getSector();
        
        // Generate JWT token
        String token = jwtUtil.generateToken(
                user.getUsername(),
                user.getRole().toString(),
                sector.getName()
        );
        
        log.info("Login successful for user: {} in sector: {}", username, sector.getCode());
        
        // Log successful authentication
        auditService.logAuthentication(user.getId(), "LOGIN_SUCCESS", true, 
                null, "User logged in successfully to sector: " + sector.getCode());
        
        // Build and return response
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

    public User createUser(String username, String password, User.Role role, Long sectorId) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        // Set sector if provided
        if (sectorId != null) {
            sectorRepository.findById(sectorId).ifPresent(user::setSector);
        }
        return userRepository.save(user);
    }

    public boolean userExists(String username) {
        return userRepository.findByUsername(username) != null;
    }
    
    /**
     * Update user's sector assignment
     * 
     * @param userId The user ID
     * @param sectorId The sector ID to assign
     * @return Updated user
     */
    @Transactional
    public User updateUserSector(Long userId, Long sectorId) {
        log.info("Updating sector for user ID: {} to sector ID: {}", userId, sectorId);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        Sector sector = sectorRepository.findById(sectorId)
                .orElseThrow(() -> new IllegalArgumentException("Sector not found"));
        
        user.setSector(sector);
        User updatedUser = userRepository.save(user);
        
        log.info("Sector updated successfully for user: {}", user.getUsername());
        
        // Log sector assignment
        auditService.logAction(userId, sectorId, null, "SECTOR_ASSIGNED", 
                "USER", userId.toString(), null, null);
        
        return updatedUser;
    }
}