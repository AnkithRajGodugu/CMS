package com.example.cms.integration;

import com.example.cms.config.NoSecurityConfig;
import com.example.cms.entity.Sector;
import com.example.cms.model.SectorContext;
import com.example.cms.repository.CustomerRepository;
import com.example.cms.repository.SectorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")

@Import({
        NoSecurityConfig.class,

})
class CustomerBulkIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    SectorRepository sectorRepository;

    @Autowired
    CustomerRepository customerRepository;

    Sector sector;

    @BeforeEach
    void setup() {
        customerRepository.deleteAll();
        sectorRepository.deleteAll();

        sector = sectorRepository.save(
                Sector.builder()
                        .name("Banking")
                        .code("BANKING")
                        .routePath("/banking")
                        .enabled(true)
                        .displayOrder(1)
                        .build()
        );
    }

    @Test

    @WithMockUser(roles = "ADMIN")


        void bulkCreateCustomers_shouldCreateCustomersAndReturn200() throws Exception {

        String csv = """
                firstName,lastName,email,phone
                John,Doe,john@example.com,999
                Jane,Smith,jane@example.com,888
                """;

        MockMultipartFile file =
                new MockMultipartFile("file", "c.csv", "text/csv", csv.getBytes());

        SectorContext ctx = SectorContext.builder()
                .sectorId(sector.getId())
                .roles(Set.of("ROLE_ADMIN"))
                .build();

        mockMvc.perform(
                        multipart("/api/v1/sectors/customers/bulk")
                                .file(file)
                                .requestAttr("sectorContext", ctx)
                )
                .andExpect(status().isOk());

        assertThat(customerRepository.findBySectorId(sector.getId()))
                .hasSize(2);
    }
}
