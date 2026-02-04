package com.example.cms.integration;

import com.example.cms.config.TestcontainersConfig;
import com.example.cms.entity.Sector;
import com.example.cms.entity.User;
import com.example.cms.entity.UserType;
import com.example.cms.repository.SectorRepository;
import com.example.cms.repository.UserRepository;
import com.example.cms.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Disabled("Disabled until Docker/Testcontainers is enabled")

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class SectorAuthorizationFilterIntegrationTest extends TestcontainersConfig {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SectorRepository sectorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    private Sector bankingSector;
    private Sector healthcareSector;
    private User bankingUser;
    private String bankingUserToken;

    @BeforeEach
    void setUp() {
        // Clean up
        userRepository.deleteAll();
        sectorRepository.deleteAll();

        // Create banking sector
        bankingSector = new Sector();
        bankingSector.setCode("BANKING");
        bankingSector.setName("Banking & Finance");
        bankingSector.setRoutePath("/banking");
        bankingSector.setEnabled(true);
        bankingSector = sectorRepository.save(bankingSector);

        // Create healthcare sector
        healthcareSector = new Sector();
        healthcareSector.setCode("HEALTHCARE");
        healthcareSector.setName("Healthcare");
        healthcareSector.setRoutePath("/healthcare");
        healthcareSector.setEnabled(true);
        healthcareSector = sectorRepository.save(healthcareSector);

        // Create banking user
        bankingUser = new User("bankinguser", passwordEncoder.encode("password"), User.Role.USER);
        bankingUser.setEmail("banking@test.com");
        bankingUser.setSector(bankingSector);
        bankingUser.setUserType(UserType.INDIVIDUAL);
        bankingUser.setEnabled(true);
        
        Set<String> roles = new HashSet<>();
        roles.add("ROLE_USER");
        bankingUser.setRoles(roles);
        
        bankingUser = userRepository.save(bankingUser);

        // Generate JWT token for banking user
        bankingUserToken = jwtUtil.generateToken(
                bankingUser.getUsername(),
                bankingUser.getRole().toString(),
                bankingSector.getName()
        );
    }

    @Test
    void accessOwnSector_ShouldBeAllowed() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/sectors/banking/accounts")
                        .header("Authorization", "Bearer " + bankingUserToken))
                .andExpect(status().isOk());
    }

    @Test
    void accessDifferentSector_ShouldBeForbidden() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/sectors/healthcare/patients")
                        .header("Authorization", "Bearer " + bankingUserToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403))
                .andExpect(jsonPath("$.message").exists())
                .andExpect(jsonPath("$.requestedSector").value("healthcare"))
                .andExpect(jsonPath("$.userSector").value("BANKING"));
    }

    @Test
    void accessWithoutAuthentication_ShouldBeUnauthorized() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/sectors/banking/accounts"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void accessNonSectorEndpoint_ShouldNotBeFiltered() throws Exception {
        // Act & Assert - public endpoints should not be filtered
        mockMvc.perform(get("/api/public/sectors"))
                .andExpect(status().isOk());
    }
}
