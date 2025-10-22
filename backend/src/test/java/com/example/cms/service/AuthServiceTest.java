package com.example.cms.service;

import com.example.cms.dto.LoginResponse;
import com.example.cms.entity.Sector;
import com.example.cms.entity.User;
import com.example.cms.entity.UserType;
import com.example.cms.exception.SectorNotAssignedException;
import com.example.cms.model.SectorContext;
import com.example.cms.repository.SectorRepository;
import com.example.cms.repository.UserRepository;
import com.example.cms.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private SectorDetectionService sectorDetectionService;

    @Mock
    private SectorRepository sectorRepository;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    private Sector testSector;

    @BeforeEach
    void setUp() {
        // Create test sector
        testSector = new Sector();
        testSector.setId(1L);
        testSector.setCode("BANKING");
        testSector.setName("Banking & Finance");
        testSector.setRoutePath("/banking");

        // Create test user
        testUser = new User("testuser", "encodedPassword", User.Role.USER);
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setSector(testSector);
        testUser.setUserType(UserType.INDIVIDUAL);
        
        Set<String> roles = new HashSet<>();
        roles.add("ROLE_USER");
        testUser.setRoles(roles);
    }

    @Test
    void authenticate_WithValidCredentials_ShouldReturnUser() {
        // Arrange
        when(userRepository.findByUsername("testuser")).thenReturn(testUser);
        when(passwordEncoder.matches("password", "encodedPassword")).thenReturn(true);

        // Act
        Optional<User> result = authService.authenticate("testuser", "password");

        // Assert
        assertTrue(result.isPresent());
        assertEquals(testUser, result.get());
        verify(userRepository, times(1)).findByUsername("testuser");
        verify(passwordEncoder, times(1)).matches("password", "encodedPassword");
    }

    @Test
    void authenticate_WithInvalidPassword_ShouldReturnEmpty() {
        // Arrange
        when(userRepository.findByUsername("testuser")).thenReturn(testUser);
        when(passwordEncoder.matches("wrongpassword", "encodedPassword")).thenReturn(false);

        // Act
        Optional<User> result = authService.authenticate("testuser", "wrongpassword");

        // Assert
        assertFalse(result.isPresent());
        verify(userRepository, times(1)).findByUsername("testuser");
        verify(passwordEncoder, times(1)).matches("wrongpassword", "encodedPassword");
    }

    @Test
    void authenticate_WithNonExistentUser_ShouldReturnEmpty() {
        // Arrange
        when(userRepository.findByUsername("nonexistent")).thenReturn(null);

        // Act
        Optional<User> result = authService.authenticate("nonexistent", "password");

        // Assert
        assertFalse(result.isPresent());
        verify(userRepository, times(1)).findByUsername("nonexistent");
        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    void login_WithValidCredentials_ShouldReturnLoginResponse() {
        // Arrange
        when(userRepository.findByUsername("testuser")).thenReturn(testUser);
        when(passwordEncoder.matches("password", "encodedPassword")).thenReturn(true);
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        
        SectorContext sectorContext = SectorContext.builder()
                .sectorId(1L)
                .sectorCode("BANKING")
                .userId(1L)
                .build();
        when(sectorDetectionService.detectSectorByUsername("testuser")).thenReturn(sectorContext);
        when(jwtUtil.generateToken("testuser", "USER", "Banking & Finance")).thenReturn("test-jwt-token");

        // Act
        LoginResponse result = authService.login("testuser", "password");

        // Assert
        assertNotNull(result);
        assertTrue(result.isSuccess());
        assertEquals("test-jwt-token", result.getToken());
        assertNotNull(result.getUser());
        assertEquals("testuser", result.getUser().getUsername());
        assertNotNull(result.getSector());
        assertEquals("BANKING", result.getSector().getCode());

        verify(userRepository, times(1)).findByUsername("testuser");
        verify(userRepository, times(1)).save(any(User.class));
        verify(sectorDetectionService, times(1)).detectSectorByUsername("testuser");
        verify(jwtUtil, times(1)).generateToken("testuser", "USER", "Banking & Finance");
        verify(auditService, times(1)).logAuthentication(eq(1L), eq("LOGIN_SUCCESS"), eq(true), isNull(), anyString());
    }

    @Test
    void login_WithInvalidCredentials_ShouldReturnFailureResponse() {
        // Arrange
        when(userRepository.findByUsername("testuser")).thenReturn(testUser);
        when(passwordEncoder.matches("wrongpassword", "encodedPassword")).thenReturn(false);

        // Act
        LoginResponse result = authService.login("testuser", "wrongpassword");

        // Assert
        assertNotNull(result);
        assertFalse(result.isSuccess());
        assertEquals("Invalid credentials", result.getMessage());
        assertNull(result.getToken());

        verify(userRepository, times(1)).findByUsername("testuser");
        verify(auditService, times(1)).logAuthentication(isNull(), eq("LOGIN_FAILED"), eq(false), isNull(), anyString());
        verify(sectorDetectionService, never()).detectSectorByUsername(anyString());
        verify(jwtUtil, never()).generateToken(anyString(), anyString(), anyString());
    }

    @Test
    void login_WithNoSectorAssigned_ShouldThrowException() {
        // Arrange
        testUser.setSector(null);
        when(userRepository.findByUsername("testuser")).thenReturn(testUser);
        when(passwordEncoder.matches("password", "encodedPassword")).thenReturn(true);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act & Assert
        assertThrows(SectorNotAssignedException.class, () -> {
            authService.login("testuser", "password");
        });

        verify(userRepository, times(1)).findByUsername("testuser");
        verify(auditService, times(1)).logAuthentication(eq(1L), eq("LOGIN_NO_SECTOR"), eq(false), isNull(), anyString());
        verify(sectorDetectionService, never()).detectSectorByUsername(anyString());
    }

    @Test
    void findByUsername_WithExistingUser_ShouldReturnUser() {
        // Arrange
        when(userRepository.findByUsername("testuser")).thenReturn(testUser);

        // Act
        Optional<User> result = authService.findByUsername("testuser");

        // Assert
        assertTrue(result.isPresent());
        assertEquals(testUser, result.get());
        verify(userRepository, times(1)).findByUsername("testuser");
    }

    @Test
    void findByUsername_WithNonExistentUser_ShouldReturnEmpty() {
        // Arrange
        when(userRepository.findByUsername("nonexistent")).thenReturn(null);

        // Act
        Optional<User> result = authService.findByUsername("nonexistent");

        // Assert
        assertFalse(result.isPresent());
        verify(userRepository, times(1)).findByUsername("nonexistent");
    }

    @Test
    void updateUserSector_WithValidData_ShouldUpdateAndReturnUser() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(sectorRepository.findById(2L)).thenReturn(Optional.of(testSector));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        User result = authService.updateUserSector(1L, 2L);

        // Assert
        assertNotNull(result);
        verify(userRepository, times(1)).findById(1L);
        verify(sectorRepository, times(1)).findById(2L);
        verify(userRepository, times(1)).save(any(User.class));
        verify(auditService, times(1)).logAction(eq(1L), eq(2L), isNull(), eq("SECTOR_ASSIGNED"), eq("USER"), eq("1"), isNull(), isNull());
    }

    @Test
    void updateUserSector_WithInvalidUserId_ShouldThrowException() {
        // Arrange
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            authService.updateUserSector(999L, 1L);
        });

        verify(userRepository, times(1)).findById(999L);
        verify(sectorRepository, never()).findById(anyLong());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void updateUserSector_WithInvalidSectorId_ShouldThrowException() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(sectorRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            authService.updateUserSector(1L, 999L);
        });

        verify(userRepository, times(1)).findById(1L);
        verify(sectorRepository, times(1)).findById(999L);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void userExists_WithExistingUser_ShouldReturnTrue() {
        // Arrange
        when(userRepository.findByUsername("testuser")).thenReturn(testUser);

        // Act
        boolean result = authService.userExists("testuser");

        // Assert
        assertTrue(result);
        verify(userRepository, times(1)).findByUsername("testuser");
    }

    @Test
    void userExists_WithNonExistentUser_ShouldReturnFalse() {
        // Arrange
        when(userRepository.findByUsername("nonexistent")).thenReturn(null);

        // Act
        boolean result = authService.userExists("nonexistent");

        // Assert
        assertFalse(result);
        verify(userRepository, times(1)).findByUsername("nonexistent");
    }
}
