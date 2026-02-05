package com.example.cms;

import com.example.cms.config.NoSecurityConfig;
import com.example.cms.entity.Customer;
import com.example.cms.entity.Sector;
import com.example.cms.repository.CustomerRepository;
import com.example.cms.repository.SectorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Import(NoSecurityConfig.class)
class CustomerReportTest {

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

        Customer c = new Customer();
        c.setFirstName("John");
        c.setLastName("Doe");
        c.setEmail("john@example.com");
        c.setSector(sector);
        customerRepository.save(c);
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldReturnMonthlyCustomerReport() throws Exception {

        mockMvc.perform(
                        get("/api/v1/sectors/customers/reports/monthly")
                                .param("start", "2026-01-01")
                                .param("end", "2026-12-31")
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].count").value(1));
    }
}
