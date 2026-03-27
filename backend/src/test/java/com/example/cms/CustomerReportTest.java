package com.example.cms;

import com.example.cms.config.NoSecurityConfig;
import com.example.cms.entity.Customer;
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
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
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
        customerRepository.deleteAllInBatch();
        sectorRepository.deleteAllInBatch();

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

        // Do NOT manually set createdAt
        // Let @PrePersist set it to now()

        customerRepository.save(c);
    }

    @Test
    @WithMockUser(roles = "MANAGER")
    void shouldReturnMonthlyCustomerReport() throws Exception {

        LocalDate now = LocalDate.now();

        SectorContext ctx = SectorContext.builder()
                .sectorId(sector.getId())
                .sectorCode("BANKING")
                .userId(1L)
                .userType(UserType.INDIVIDUAL)
                .roles(Set.of("ROLE_MANAGER"))
                .build();

        mockMvc.perform(
                        get("/api/v1/sectors/customers/reports/monthly")
                                .param("start", now.withDayOfYear(1).toString())
                                .param("end", now.withMonth(12).withDayOfMonth(31).toString())
                                .requestAttr("sectorContext", ctx)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].count").value(1));
    }
}