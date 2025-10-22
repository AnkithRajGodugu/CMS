package com.example.cms.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.cms.entity.Sector;
import com.example.cms.entity.User;
import com.example.cms.repository.SectorRepository;
import com.example.cms.repository.UserRepository;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SectorRepository sectorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/init-users")
    public Map<String, Object> initializeUsers() {
        Map<String, Object> result = new HashMap<>();

        try {
            // Check if users already exist
            long userCount = userRepository.count();
            result.put("existingUsers", userCount);

            if (userCount == 0) {
                // Create sectors if they don't exist
                if (sectorRepository.count() == 0) {
                    Sector banking = new Sector("Banking", "Banking & Finance");
                    Sector healthcare = new Sector("Healthcare", "Healthcare Services");
                    Sector logistics = new Sector("Logistics", "Logistics & Supply Chain");
                    Sector content = new Sector("Content", "Content Creation");

                    sectorRepository.save(banking);
                    sectorRepository.save(healthcare);
                    sectorRepository.save(logistics);
                    sectorRepository.save(content);

                    result.put("sectorsCreated", 4);
                }

                // Get sectors
                Sector bankingSector = sectorRepository.findByName("Banking").orElse(null);
                Sector healthcareSector = sectorRepository.findByName("Healthcare").orElse(null);
                Sector logisticsSector = sectorRepository.findByName("Logistics").orElse(null);
                Sector contentSector = sectorRepository.findByName("Content").orElse(null);

                // Create users
                User admin = new User("admin", passwordEncoder.encode("admin123"), User.Role.ADMIN);
                admin.setSector(bankingSector);
                userRepository.save(admin);

                User bankingUser = new User("bank_user", passwordEncoder.encode("bank123"), User.Role.BANKING);
                bankingUser.setSector(bankingSector);
                userRepository.save(bankingUser);

                User healthcareUser = new User("health_user", passwordEncoder.encode("health123"), User.Role.HEALTHCARE);
                healthcareUser.setSector(healthcareSector);
                userRepository.save(healthcareUser);

                User logisticsUser = new User("logistics_user", passwordEncoder.encode("logistics123"), User.Role.LOGISTICS);
                logisticsUser.setSector(logisticsSector);
                userRepository.save(logisticsUser);

                User contentUser = new User("content_user", passwordEncoder.encode("content123"), User.Role.CONTENT);
                contentUser.setSector(contentSector);
                userRepository.save(contentUser);

                result.put("usersCreated", 5);
                result.put("message", "Users initialized successfully");
            } else {
                result.put("message", "Users already exist");
            }

            result.put("success", true);

        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
        }

        return result;
    }

    @GetMapping("/users")
    public Map<String, Object> listUsers() {
        Map<String, Object> result = new HashMap<>();
        result.put("totalUsers", userRepository.count());

        // Get user info without passwords
        var users = userRepository.findAll().stream()
                .map(user -> Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "role", user.getRole().toString(),
                "sector", user.getSector() != null ? user.getSector().getName() : "None"
        ))
                .toList();

        result.put("users", users);
        return result;
    }

    @GetMapping("/debug-login/{username}")
    public Map<String, Object> debugLogin(@PathVariable String username) {
        Map<String, Object> result = new HashMap<>();

        var user = userRepository.findByUsername(username);
        if (user != null) {
            result.put("found", true);
            result.put("username", user.getUsername());
            result.put("role", user.getRole().toString());
            result.put("hasPassword", user.getPassword() != null && !user.getPassword().isEmpty());
            result.put("passwordLength", user.getPassword() != null ? user.getPassword().length() : 0);
        } else {
            result.put("found", false);
        }

        return result;
    }

    @GetMapping("/create-sector-users")
    public Map<String, Object> createSectorUsers() {
        Map<String, Object> result = new HashMap<>();

        try {
            // Get sectors
            Sector healthcareSector = sectorRepository.findByName("Healthcare").orElse(null);
            Sector logisticsSector = sectorRepository.findByName("Logistics").orElse(null);
            Sector contentSector = sectorRepository.findByName("Content").orElse(null);

            int usersCreated = 0;

            // Create healthcare user if doesn't exist (using USER role for now)
            if (userRepository.findByUsername("health_user") == null && healthcareSector != null) {
                User healthcareUser = new User("health_user", passwordEncoder.encode("health123"), User.Role.USER);
                healthcareUser.setSector(healthcareSector);
                userRepository.save(healthcareUser);
                usersCreated++;
            }

            // Create logistics user if doesn't exist (using USER role for now)
            if (userRepository.findByUsername("logistics_user") == null && logisticsSector != null) {
                User logisticsUser = new User("logistics_user", passwordEncoder.encode("logistics123"), User.Role.USER);
                logisticsUser.setSector(logisticsSector);
                userRepository.save(logisticsUser);
                usersCreated++;
            }

            // Create content user if doesn't exist (using USER role for now)
            if (userRepository.findByUsername("content_user") == null && contentSector != null) {
                User contentUser = new User("content_user", passwordEncoder.encode("content123"), User.Role.USER);
                contentUser.setSector(contentSector);
                userRepository.save(contentUser);
                usersCreated++;
            }

            // Also create bank_user if doesn't exist (using USER role for now)
            Sector bankingSector = sectorRepository.findByName("Banking").orElse(null);
            if (userRepository.findByUsername("bank_user") == null && bankingSector != null) {
                User bankUser = new User("bank_user", passwordEncoder.encode("bank123"), User.Role.USER);
                bankUser.setSector(bankingSector);
                userRepository.save(bankUser);
                usersCreated++;
            }

            result.put("success", true);
            result.put("usersCreated", usersCreated);
            result.put("totalUsers", userRepository.count());
            result.put("message", "Sector users created successfully");

        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
        }

        return result;
    }
}
