package com.example.cms.integration;

import com.example.cms.config.TestcontainersConfig;
import com.example.cms.entity.Organization;
import com.example.cms.entity.Sector;
import com.example.cms.entity.User;
import com.example.cms.entity.UserType;
import com.example.cms.repository.OrganizationRepository;
import com.example.cms.repository.SectorRepository;
import com.example.cms.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
@Disabled("Disabled until Docker/Testcontainers is enabled")

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class DatabaseIntegrationTest extends TestcontainersConfig {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SectorRepository sectorRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @BeforeEach
    void setUp() {
        // Clean up
        userRepository.deleteAll();
        organizationRepository.deleteAll();
        sectorRepository.deleteAll();
    }

    @Test
    void saveSector_ShouldPersistToDatabase() {
        // Arrange
        Sector sector = new Sector();
        sector.setCode("BANKING");
        sector.setName("Banking & Finance");
        sector.setRoutePath("/banking");
        sector.setEnabled(true);
        sector.setDisplayOrder(1);

        // Act
        Sector savedSector = sectorRepository.save(sector);

        // Assert
        assertNotNull(savedSector.getId());
        assertEquals("BANKING", savedSector.getCode());

        // Verify persistence
        Sector fetchedSector = sectorRepository.findById(savedSector.getId()).orElseThrow();
        assertEquals("Banking & Finance", fetchedSector.getName());
    }

    @Test
    void saveOrganization_WithSector_ShouldPersistRelationship() {
        // Arrange
        Sector sector = new Sector();
        sector.setCode("BANKING");
        sector.setName("Banking & Finance");
        sector.setRoutePath("/banking");
        sector.setEnabled(true);
        sector = sectorRepository.save(sector);

        Organization organization = new Organization();
        organization.setName("Test Bank");
        organization.setDomain("testbank.com");
        organization.setSector(sector);
        organization.setActive(true);

        // Act
        Organization savedOrg = organizationRepository.save(organization);

        // Assert
        assertNotNull(savedOrg.getId());
        assertNotNull(savedOrg.getSector());
        assertEquals(sector.getId(), savedOrg.getSector().getId());

        // Verify persistence
        Organization fetchedOrg = organizationRepository.findById(savedOrg.getId()).orElseThrow();
        assertEquals("Test Bank", fetchedOrg.getName());
        assertEquals(sector.getId(), fetchedOrg.getSector().getId());
    }

    @Test
    void saveUser_WithSectorAndOrganization_ShouldPersistRelationships() {
        // Arrange
        Sector sector = new Sector();
        sector.setCode("BANKING");
        sector.setName("Banking & Finance");
        sector.setRoutePath("/banking");
        sector.setEnabled(true);
        sector = sectorRepository.save(sector);

        Organization organization = new Organization();
        organization.setName("Test Bank");
        organization.setSector(sector);
        organization.setActive(true);
        organization = organizationRepository.save(organization);

        User user = new User("testuser", "password", User.Role.USER);
        user.setEmail("test@example.com");
        user.setSector(sector);
        user.setOrganization(organization);
        user.setUserType(UserType.ORGANIZATION);
        user.setEnabled(true);
        
        Set<String> roles = new HashSet<>();
        roles.add("ROLE_USER");
        user.setRoles(roles);

        // Act
        User savedUser = userRepository.save(user);

        // Assert
        assertNotNull(savedUser.getId());
        assertNotNull(savedUser.getSector());
        assertNotNull(savedUser.getOrganization());
        assertEquals(sector.getId(), savedUser.getSector().getId());
        assertEquals(organization.getId(), savedUser.getOrganization().getId());

        // Verify persistence
        User fetchedUser = userRepository.findById(savedUser.getId()).orElseThrow();
        assertEquals("testuser", fetchedUser.getUsername());
        assertEquals(sector.getId(), fetchedUser.getSector().getId());
        assertEquals(organization.getId(), fetchedUser.getOrganization().getId());
    }

    @Test
    void findOrganizationsBySector_ShouldReturnFilteredResults() {
        // Arrange
        Sector bankingSector = new Sector();
        bankingSector.setCode("BANKING");
        bankingSector.setName("Banking");
        bankingSector.setRoutePath("/banking");
        bankingSector.setEnabled(true);
        bankingSector = sectorRepository.save(bankingSector);

        Sector healthcareSector = new Sector();
        healthcareSector.setCode("HEALTHCARE");
        healthcareSector.setName("Healthcare");
        healthcareSector.setRoutePath("/healthcare");
        healthcareSector.setEnabled(true);
        healthcareSector = sectorRepository.save(healthcareSector);

        Organization bankingOrg = new Organization();
        bankingOrg.setName("Bank 1");
        bankingOrg.setSector(bankingSector);
        bankingOrg.setActive(true);
        organizationRepository.save(bankingOrg);

        Organization healthcareOrg = new Organization();
        healthcareOrg.setName("Hospital 1");
        healthcareOrg.setSector(healthcareSector);
        healthcareOrg.setActive(true);
        organizationRepository.save(healthcareOrg);

        // Act
        List<Organization> bankingOrgs = organizationRepository.findBySectorId(bankingSector.getId());

        // Assert
        assertEquals(1, bankingOrgs.size());
        assertEquals("Bank 1", bankingOrgs.get(0).getName());
    }

    @Test
    void findUserByUsername_ShouldReturnUser() {
        // Arrange
        Sector sector = new Sector();
        sector.setCode("BANKING");
        sector.setName("Banking");
        sector.setRoutePath("/banking");
        sector.setEnabled(true);
        sector = sectorRepository.save(sector);

        User user = new User("findme", "password", User.Role.USER);
        user.setEmail("findme@test.com");
        user.setSector(sector);
        user.setUserType(UserType.INDIVIDUAL);
        user.setEnabled(true);
        
        Set<String> roles = new HashSet<>();
        roles.add("ROLE_USER");
        user.setRoles(roles);
        
        userRepository.save(user);

        // Act
        User foundUser = userRepository.findByUsername("findme");

        // Assert
        assertNotNull(foundUser);
        assertEquals("findme", foundUser.getUsername());
        assertEquals("findme@test.com", foundUser.getEmail());
    }

    @Test
    void deleteOrganization_ShouldRemoveFromDatabase() {
        // Arrange
        Sector sector = new Sector();
        sector.setCode("BANKING");
        sector.setName("Banking");
        sector.setRoutePath("/banking");
        sector.setEnabled(true);
        sector = sectorRepository.save(sector);

        Organization organization = new Organization();
        organization.setName("To Delete");
        organization.setSector(sector);
        organization.setActive(true);
        organization = organizationRepository.save(organization);

        Long orgId = organization.getId();

        // Act
        organizationRepository.delete(organization);

        // Assert
        assertFalse(organizationRepository.findById(orgId).isPresent());
    }
}
