package com.example.cms.integration;

import com.example.cms.config.*;
import com.example.cms.dto.LoginResponse;
import com.example.cms.entity.Sector;
import com.example.cms.entity.User;
import com.example.cms.entity.UserType;
import com.example.cms.repository.SectorRepository;
import com.example.cms.repository.UserRepository;
import com.example.cms.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
@Disabled("Disabled until Docker/Testcontainers is enabled")

@SpringBootTest
@Import({
        NoSecurityConfig.class,
        TestKafkaConfig.class,
        TestKafkaDisableConfig.class
})

@ActiveProfiles("test")
@Transactional
class AuthenticationIntegrationTest extends TestcontainersConfig {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SectorRepository sectorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private Sector testSector;
    private User testUser;

    @BeforeEach
    void setUp() {
        // Clean up
        userRepository.deleteAll();
        sectorRepository.deleteAll();

        // Create test sector
        testSector = new Sector();
        testSector.setCode("BANKING");
        testSector.setName("Banking & Finance");
        testSector.setDescription("Banking sector");
        testSector.setRoutePath("/banking");
        testSector.setEnabled(true);
        testSector.setDisplayOrder(1);
        testSector = sectorRepository.save(testSector);

        // Create test user
        testUser = new User("integrationuser", passwordEncoder.encode("password123"), User.Role.USER);
        testUser.setEmail("integration@test.com");
        testUser.setSector(testSector);
        testUser.setUserType(UserType.INDIVIDUAL);
        testUser.setEnabled(true);
        
        Set<String> roles = new HashSet<>();
        roles.add("ROLE_USER");
        testUser.setRoles(roles);
        
        testUser = userRepository.save(testUser);
    }

    @Test
    void login_WithValidCredentials_ShouldReturnSuccessResponse() {
        // Act
        LoginResponse response = authService.login("integrationuser", "password123");

        // Assert
        assertNotNull(response);
        assertTrue(response.isSuccess());
        assertNotNull(response.getToken());
        assertNotNull(response.getUser());
        assertEquals("integrationuser", response.getUser().getUsername());
        assertNotNull(response.getSector());
        assertEquals("BANKING", response.getSector().getCode());
        assertEquals("/banking", response.getSector().getRoutePath());
    }

    @Test
    void login_WithInvalidPassword_ShouldReturnFailureResponse() {
        // Act
        LoginResponse response = authService.login("integrationuser", "wrongpassword");

        // Assert
        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertNull(response.getToken());
        assertEquals("Invalid credentials", response.getMessage());
    }

    @Test
    void login_WithNonExistentUser_ShouldReturnFailureResponse() {
        // Act
        LoginResponse response = authService.login("nonexistent", "password123");

        // Assert
        assertNotNull(response);
        assertFalse(response.isSuccess());
        assertNull(response.getToken());
    }

    @Test
    void updateUserSector_ShouldPersistChanges() {
        // Arrange
        Sector newSector = new Sector();
        newSector.setCode("HEALTHCARE");
        newSector.setName("Healthcare");
        newSector.setRoutePath("/healthcare");
        newSector.setEnabled(true);
        newSector = sectorRepository.save(newSector);

        // Act
        User updatedUser = authService.updateUserSector(testUser.getId(), newSector.getId());

        // Assert
        assertNotNull(updatedUser);
        assertEquals(newSector.getId(), updatedUser.getSector().getId());

        // Verify persistence
        User fetchedUser = userRepository.findById(testUser.getId()).orElseThrow();
        assertEquals(newSector.getId(), fetchedUser.getSector().getId());
    }

    @Test
    void authenticate_WithValidCredentials_ShouldReturnUser() {
        // Act
        var result = authService.authenticate("integrationuser", "password123");

        // Assert
        assertTrue(result.isPresent());
        assertEquals("integrationuser", result.get().getUsername());
    }

    @Test
    void userExists_WithExistingUser_ShouldReturnTrue() {
        // Act
        boolean exists = authService.userExists("integrationuser");

        // Assert
        assertTrue(exists);
    }

    @Test
    void userExists_WithNonExistentUser_ShouldReturnFalse() {
        // Act
        boolean exists = authService.userExists("nonexistent");

        // Assert
        assertFalse(exists);
    }
}
