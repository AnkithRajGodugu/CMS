package com.example.cms.integration;

import com.example.cms.entity.Sector;
import com.example.cms.entity.UserType;
import com.example.cms.model.SectorContext;
import com.example.cms.repository.CustomerRepository;
import com.example.cms.repository.SectorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class CustomerBulkIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SectorRepository sectorRepository;

    @Autowired
    private CustomerRepository customerRepository;

    private Sector sector;

    @BeforeEach
    void setup() {
        customerRepository.deleteAll();
        sectorRepository.deleteAll();

        sector = new Sector();
        sector.setName("Banking");
        sector.setCode("BANKING");
        sector.setRoutePath("/banking");
        sector.setEnabled(true);
        sector.setDisplayOrder(1);

        sector = sectorRepository.save(sector);
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void bulkCreateCustomers_shouldCreateCustomersAndReturn200() throws Exception {

        String csv = """
                firstName,lastName,email,phone
                John,Doe,john@example.com,9999999999
                Jane,Smith,jane@example.com,8888888888
                """;

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "customers.csv",
                MediaType.TEXT_PLAIN_VALUE,
                csv.getBytes()
        );

        SectorContext ctx = SectorContext.builder()
                .sectorId(sector.getId())
                .sectorCode("BANKING")
                .userId(1L)
                .organizationId(null)
                .userType(UserType.INDIVIDUAL)
                .roles(Set.of("ROLE_ADMIN"))
                .build();

        mockMvc.perform(
                        multipart("/api/sectors/customers/bulk")
                                .file(file)
                                .requestAttr("sectorContext", ctx)
                )
                .andExpect(status().isOk());

        assertThat(customerRepository.findBySectorId(sector.getId()))
                .hasSize(2);
    }
}
