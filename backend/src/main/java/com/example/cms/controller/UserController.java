// New UserController.java (CRUD for users, admin only)
package com.example.cms.controller;

import com.example.cms.entity.User;
import com.example.cms.repository.UserRepository;
import com.example.cms.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;
import java.io.IOException;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            return null;
        }

        Object principal = auth.getPrincipal();
        if (principal instanceof com.example.cms.security.CustomUserDetails customUserDetails) {
            return customUserDetails.getUser();
        }

        return null;
    }

    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody User user) {

        User currentUser = getCurrentUser();
        if (currentUser == null || currentUser.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // 🔴 Force sector required for ALL non-admin roles
        if (user.getRole() != User.Role.ADMIN && user.getSector() == null) {
            return ResponseEntity.badRequest().build();
        }

        // Keep your manager rule
        if (user.getRole() == User.Role.MANAGER && user.getSector() == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(userService.createUser(user));
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {

        User currentUser = getCurrentUser();
        if (currentUser == null || currentUser.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<User> users = userService.getAllUsers();
        return users.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {

        User currentUser = getCurrentUser();
        if (currentUser == null || currentUser.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody User userDetails
    ) {

        User currentUser = getCurrentUser();
        if (currentUser == null || currentUser.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // 🔴 Force sector required for ALL non-admin roles
        if (userDetails.getRole() != User.Role.ADMIN && userDetails.getSector() == null) {
            return ResponseEntity.badRequest().build();
        }

        // Keep manager rule
        if (userDetails.getRole() == User.Role.MANAGER && userDetails.getSector() == null) {
            return ResponseEntity.badRequest().build();
        }

        return userService.updateUser(id, userDetails)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {

        User currentUser = getCurrentUser();
        if (currentUser == null || currentUser.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return userService.deleteUser(id)
                ? ResponseEntity.ok().build()
                : ResponseEntity.notFound().build();
    }

    /**
     * Change current user's password (self-service)
     */
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> body) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String currentPassword = body.get("currentPassword");
        String newPassword     = body.get("newPassword");

        if (currentPassword == null || newPassword == null || newPassword.length() < 8) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid password data"));
        }

        return userService.changePassword(currentUser.getId(), currentPassword, newPassword)
                ? ResponseEntity.ok(Map.of("message", "Password changed successfully"))
                : ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Current password is incorrect"));
    }

    // ─── Enhanced Profiles (Feature #8) ──────────────────────────────────────

    @GetMapping("/profile")
    public ResponseEntity<User> getMyProfile() {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(currentUser);
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateMyProfile(@RequestBody Map<String, String> profileData) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (profileData.containsKey("bio")) currentUser.setBio(profileData.get("bio"));
        if (profileData.containsKey("phone")) currentUser.setPhone(profileData.get("phone"));
        if (profileData.containsKey("preferences")) currentUser.setPreferences(profileData.get("preferences"));

        User updatedUser = userRepository.save(currentUser);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/profile/avatar")
    public ResponseEntity<Map<String, String>> uploadAvatar(@RequestParam("file") MultipartFile file) {
        User currentUser = getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "File is empty"));
        }

        try {
            String fileName = StringUtils.cleanPath(file.getOriginalFilename());
            String extension = "";
            int i = fileName.lastIndexOf('.');
            if (i > 0) {
                extension = fileName.substring(i);
            }
            // Generate unique filename: avatar_userId_timestamp.ext
            String newFileName = "avatar_" + currentUser.getId() + "_" + System.currentTimeMillis() + extension;
            
            // Defines the upload directory inside the current working directory relative path
            Path uploadPath = Paths.get("uploads", "avatars");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(newFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Setting URL to serve statically (Needs WebMvcConfigurer)
            String avatarUrl = "/uploads/avatars/" + newFileName;
            currentUser.setAvatarUrl(avatarUrl);
            userRepository.save(currentUser);

            return ResponseEntity.ok(Map.of("avatarUrl", avatarUrl, "message", "Avatar uploaded successfully"));
            
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to store file", "error", e.getMessage()));
        }
    }
}