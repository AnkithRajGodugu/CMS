package com.example.cms.service;

import com.example.cms.entity.Organization;
import com.example.cms.entity.Sector;
import com.example.cms.entity.User;
import com.example.cms.entity.UserType;
import com.example.cms.exception.SectorNotAssignedException;
import com.example.cms.exception.SectorNotFoundException;
import com.example.cms.model.SectorContext;
import com.example.cms.repository.SectorRepository;
import com.example.cms.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SectorDetectionServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private SectorRepository sectorRepository;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private SectorDetectionService sectorDetectionService;

    private User testUser;
    private Sector testSector;
    private Organization testOrganization;

    @BeforeEach
    void setUp() {
        // Create test sector
        testSector = new Sector();
        testSector.setId(1L);
        testSector.setCode("BANKING");
        testSector.setName("Banking & Finance");
        testSector.setRoutePath("/banking");
        testSector.setEnabled(true);

        // Create test organization
        testOrganization = new Organization();
        testOrganization.setId(1L);
        testOrganization.setName("Test Bank");
        testOrganization.setSector(testSector);

        // Create test user
        testUser = new User("testuser", "password", User.Role.USER);
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setSector(testSector);
        testUser.setOrganization(testOrganization);
        testUser.setUserType(UserType.ORGANIZATION);
    }

    @Test
    void detectSector_WithValidUser_ShouldReturnSectorContext() {
        // Arrange
        when(authentication.getName()).thenReturn("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(testUser);

        // Act
        SectorContext result = sectorDetectionService.detectSector(authentication);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getSectorId());
        assertEquals("BANKING", result.getSectorCode());
        assertEquals(1L, result.getUserId());
        assertEquals(1L, result.getOrganizationId());
        assertEquals(UserType.ORGANIZATION, result.getUserType());
        assertTrue(result.getRoles().contains("ROLE_USER"));

        verify(userRepository, times(1)).findByUsername("testuser");
    }

    @Test
    void detectSector_WithUserNotFound_ShouldThrowException() {
        // Arrange
        when(authentication.getName()).thenReturn("nonexistent");
        when(userRepository.findByUsername("nonexistent")).thenReturn(null);

        // Act & Assert
        assertThrows(SectorNotAssignedException.class, () -> {
            sectorDetectionService.detectSector(authentication);
        });

        verify(userRepository, times(1)).findByUsername("nonexistent");
    }

    @Test
    void detectSector_WithNoSectorAssigned_ShouldThrowException() {
        // Arrange
        testUser.setSector(null);
        when(authentication.getName()).thenReturn("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(testUser);

        // Act & Assert
        SectorNotAssignedException exception = assertThrows(SectorNotAssignedException.class, () -> {
            sectorDetectionService.detectSector(authentication);
        });

        assertTrue(exception.getMessage().contains("no sector assigned"));
        verify(userRepository, times(1)).findByUsername("testuser");
    }

    @Test
    void detectSectorByUsername_WithValidUsername_ShouldReturnSectorContext() {
        // Arrange
        when(userRepository.findByUsername("testuser")).thenReturn(testUser);

        // Act
        SectorContext result = sectorDetectionService.detectSectorByUsername("testuser");

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getSectorId());
        assertEquals("BANKING", result.getSectorCode());
        assertEquals(1L, result.getUserId());
        assertEquals(1L, result.getOrganizationId());

        verify(userRepository, times(1)).findByUsername("testuser");
    }

    @Test
    void detectSectorByUsername_WithIndividualUser_ShouldReturnContextWithoutOrganization() {
        // Arrange
        testUser.setOrganization(null);
        testUser.setUserType(UserType.INDIVIDUAL);
        when(userRepository.findByUsername("testuser")).thenReturn(testUser);

        // Act
        SectorContext result = sectorDetectionService.detectSectorByUsername("testuser");

        // Assert
        assertNotNull(result);
        assertNull(result.getOrganizationId());
        assertEquals(UserType.INDIVIDUAL, result.getUserType());

        verify(userRepository, times(1)).findByUsername("testuser");
    }

    @Test
    void getSectorRoutePath_WithValidSectorId_ShouldReturnRoutePath() {
        // Arrange
        when(sectorRepository.findById(1L)).thenReturn(Optional.of(testSector));

        // Act
        String result = sectorDetectionService.getSectorRoutePath(1L);

        // Assert
        assertEquals("/banking", result);
        verify(sectorRepository, times(1)).findById(1L);
    }

    @Test
    void getSectorRoutePath_WithInvalidSectorId_ShouldThrowException() {
        // Arrange
        when(sectorRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(SectorNotFoundException.class, () -> {
            sectorDetectionService.getSectorRoutePath(999L);
        });

        verify(sectorRepository, times(1)).findById(999L);
    }

    @Test
    void getSectorRoutePathByCode_WithValidCode_ShouldReturnRoutePath() {
        // Arrange
        when(sectorRepository.findAll()).thenReturn(java.util.List.of(testSector));

        // Act
        String result = sectorDetectionService.getSectorRoutePathByCode("BANKING");

        // Assert
        assertEquals("/banking", result);
        verify(sectorRepository, times(1)).findAll();
    }

    @Test
    void getSectorRoutePathByCode_WithInvalidCode_ShouldThrowException() {
        // Arrange
        when(sectorRepository.findAll()).thenReturn(java.util.List.of(testSector));

        // Act & Assert
        assertThrows(SectorNotFoundException.class, () -> {
            sectorDetectionService.getSectorRoutePathByCode("INVALID");
        });

        verify(sectorRepository, times(1)).findAll();
    }
}
