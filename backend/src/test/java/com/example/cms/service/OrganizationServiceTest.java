package com.example.cms.service;

import com.example.cms.dto.OrganizationRequest;
import com.example.cms.dto.OrganizationResponse;
import com.example.cms.entity.Organization;
import com.example.cms.entity.Sector;
import com.example.cms.entity.User;
import com.example.cms.exception.SectorNotFoundException;
import com.example.cms.repository.OrganizationRepository;
import com.example.cms.repository.SectorRepository;
import com.example.cms.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrganizationServiceTest {

    @Mock
    private OrganizationRepository organizationRepository;

    @Mock
    private SectorRepository sectorRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private OrganizationService organizationService;

    private Organization testOrganization;
    private Sector testSector;
    private User testUser;

    @BeforeEach
    void setUp() {
        // Create test sector
        testSector = new Sector();
        testSector.setId(1L);
        testSector.setCode("BANKING");
        testSector.setName("Banking & Finance");

        // Create test organization
        testOrganization = new Organization();
        testOrganization.setId(1L);
        testOrganization.setName("Test Bank");
        testOrganization.setDomain("testbank.com");
        testOrganization.setSector(testSector);
        testOrganization.setSettings("{\"key\":\"value\"}");
        testOrganization.setActive(true);
        testOrganization.setUsers(new ArrayList<>());

        // Create test user
        testUser = new User("testuser", "password", User.Role.USER);
        testUser.setId(1L);
    }

    @Test
    void getAllOrganizations_ShouldReturnAllOrganizations() {
        // Arrange
        when(organizationRepository.findAll()).thenReturn(List.of(testOrganization));

        // Act
        List<OrganizationResponse> result = organizationService.getAllOrganizations();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Bank", result.get(0).getName());
        verify(organizationRepository, times(1)).findAll();
    }

    @Test
    void getOrganizationById_WithValidId_ShouldReturnOrganization() {
        // Arrange
        when(organizationRepository.findById(1L)).thenReturn(Optional.of(testOrganization));

        // Act
        OrganizationResponse result = organizationService.getOrganizationById(1L);

        // Assert
        assertNotNull(result);
        assertEquals("Test Bank", result.getName());
        assertEquals("testbank.com", result.getDomain());
        verify(organizationRepository, times(1)).findById(1L);
    }

    @Test
    void getOrganizationById_WithInvalidId_ShouldThrowException() {
        // Arrange
        when(organizationRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            organizationService.getOrganizationById(999L);
        });

        verify(organizationRepository, times(1)).findById(999L);
    }

    @Test
    void getOrganizationsBySector_ShouldReturnFilteredOrganizations() {
        // Arrange
        when(organizationRepository.findBySectorId(1L)).thenReturn(List.of(testOrganization));

        // Act
        List<OrganizationResponse> result = organizationService.getOrganizationsBySector(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(organizationRepository, times(1)).findBySectorId(1L);
    }

    @Test
    void getActiveOrganizations_ShouldReturnOnlyActiveOrganizations() {
        // Arrange
        when(organizationRepository.findByActiveTrue()).thenReturn(List.of(testOrganization));

        // Act
        List<OrganizationResponse> result = organizationService.getActiveOrganizations();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertTrue(result.get(0).isActive());
        verify(organizationRepository, times(1)).findByActiveTrue();
    }

    @Test
    void createOrganization_WithValidRequest_ShouldCreateAndReturnOrganization() {
        // Arrange
        OrganizationRequest request = new OrganizationRequest();
        request.setName("New Bank");
        request.setDomain("newbank.com");
        request.setSectorId(1L);
        request.setSettings("{\"key\":\"value\"}");
        request.setActive(true);

        when(sectorRepository.findById(1L)).thenReturn(Optional.of(testSector));
        when(organizationRepository.save(any(Organization.class))).thenReturn(testOrganization);

        // Act
        OrganizationResponse result = organizationService.createOrganization(request);

        // Assert
        assertNotNull(result);
        verify(sectorRepository, times(1)).findById(1L);
        verify(organizationRepository, times(1)).save(any(Organization.class));
        verify(auditService, times(1)).logAction(isNull(), eq(1L), eq(1L), eq("ORGANIZATION_CREATED"), eq("ORGANIZATION"), eq("1"), isNull(), isNull());
    }

    @Test
    void createOrganization_WithInvalidSectorId_ShouldThrowException() {
        // Arrange
        OrganizationRequest request = new OrganizationRequest();
        request.setName("New Bank");
        request.setSectorId(999L);

        when(sectorRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(SectorNotFoundException.class, () -> {
            organizationService.createOrganization(request);
        });

        verify(sectorRepository, times(1)).findById(999L);
        verify(organizationRepository, never()).save(any(Organization.class));
    }

    @Test
    void updateOrganization_WithValidData_ShouldUpdateAndReturnOrganization() {
        // Arrange
        OrganizationRequest request = new OrganizationRequest();
        request.setName("Updated Bank");
        request.setDomain("updatedbank.com");
        request.setSectorId(1L);
        request.setActive(true);

        when(organizationRepository.findById(1L)).thenReturn(Optional.of(testOrganization));
        when(sectorRepository.findById(1L)).thenReturn(Optional.of(testSector));
        when(organizationRepository.save(any(Organization.class))).thenReturn(testOrganization);

        // Act
        OrganizationResponse result = organizationService.updateOrganization(1L, request);

        // Assert
        assertNotNull(result);
        verify(organizationRepository, times(1)).findById(1L);
        verify(organizationRepository, times(1)).save(any(Organization.class));
        verify(auditService, times(1)).logAction(isNull(), eq(1L), eq(1L), eq("ORGANIZATION_UPDATED"), eq("ORGANIZATION"), eq("1"), isNull(), isNull());
    }

    @Test
    void updateOrganization_WithInvalidId_ShouldThrowException() {
        // Arrange
        OrganizationRequest request = new OrganizationRequest();
        when(organizationRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            organizationService.updateOrganization(999L, request);
        });

        verify(organizationRepository, times(1)).findById(999L);
        verify(organizationRepository, never()).save(any(Organization.class));
    }

    @Test
    void deleteOrganization_WithValidId_ShouldDeleteOrganization() {
        // Arrange
        when(organizationRepository.findById(1L)).thenReturn(Optional.of(testOrganization));

        // Act
        organizationService.deleteOrganization(1L);

        // Assert
        verify(organizationRepository, times(1)).findById(1L);
        verify(organizationRepository, times(1)).delete(testOrganization);
        verify(auditService, times(1)).logAction(isNull(), eq(1L), eq(1L), eq("ORGANIZATION_DELETED"), eq("ORGANIZATION"), eq("1"), isNull(), isNull());
    }

    @Test
    void deleteOrganization_WithInvalidId_ShouldThrowException() {
        // Arrange
        when(organizationRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            organizationService.deleteOrganization(999L);
        });

        verify(organizationRepository, times(1)).findById(999L);
        verify(organizationRepository, never()).delete(any(Organization.class));
    }

    @Test
    void updateOrganizationSettings_WithValidData_ShouldUpdateSettings() throws Exception {
        // Arrange
        Map<String, Object> settings = new HashMap<>();
        settings.put("key", "newValue");

        when(organizationRepository.findById(1L)).thenReturn(Optional.of(testOrganization));
        when(objectMapper.writeValueAsString(settings)).thenReturn("{\"key\":\"newValue\"}");
        when(organizationRepository.save(any(Organization.class))).thenReturn(testOrganization);

        // Act
        OrganizationResponse result = organizationService.updateOrganizationSettings(1L, settings);

        // Assert
        assertNotNull(result);
        verify(organizationRepository, times(1)).findById(1L);
        verify(objectMapper, times(1)).writeValueAsString(settings);
        verify(organizationRepository, times(1)).save(any(Organization.class));
    }

    @Test
    void getOrganizationSettings_WithValidSettings_ShouldReturnSettings() {
        // Arrange
        Map<String, Object> expectedSettings = new HashMap<>();
        expectedSettings.put("key", "value");

        when(organizationRepository.findById(1L)).thenReturn(Optional.of(testOrganization));
        try {
            when(objectMapper.readValue("{\"key\":\"value\"}", Map.class)).thenReturn(expectedSettings);
        } catch (Exception e) {
            fail("Should not throw exception");
        }

        // Act
        Map<String, Object> result = organizationService.getOrganizationSettings(1L);

        // Assert
        assertNotNull(result);
        assertEquals("value", result.get("key"));
        verify(organizationRepository, times(1)).findById(1L);
    }

    @Test
    void getOrganizationSettings_WithNullSettings_ShouldReturnEmptyMap() {
        // Arrange
        testOrganization.setSettings(null);
        when(organizationRepository.findById(1L)).thenReturn(Optional.of(testOrganization));

        // Act
        Map<String, Object> result = organizationService.getOrganizationSettings(1L);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(organizationRepository, times(1)).findById(1L);
    }

    @Test
    void addUserToOrganization_WithValidData_ShouldAddUser() {
        // Arrange
        when(organizationRepository.findById(1L)).thenReturn(Optional.of(testOrganization));
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        organizationService.addUserToOrganization(1L, 1L);

        // Assert
        verify(organizationRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).save(any(User.class));
        verify(auditService, times(1)).logAction(eq(1L), eq(1L), eq(1L), eq("USER_ADDED_TO_ORGANIZATION"), eq("USER"), eq("1"), isNull(), isNull());
    }

    @Test
    void removeUserFromOrganization_WithValidUserId_ShouldRemoveUser() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        organizationService.removeUserFromOrganization(1L);

        // Assert
        verify(userRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void getOrganizationUsers_WithValidId_ShouldReturnUsers() {
        // Arrange
        testOrganization.setUsers(List.of(testUser));
        when(organizationRepository.findById(1L)).thenReturn(Optional.of(testOrganization));

        // Act
        List<User> result = organizationService.getOrganizationUsers(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(organizationRepository, times(1)).findById(1L);
    }
}
