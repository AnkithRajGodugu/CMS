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
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Set;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")

@Import({
        NoSecurityConfig.class,

})

class CustomerPaginationTest {

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

        sector = sectorRepository.save(
                Sector.builder()
                        .name("Banking")
                        .code("BANKING")
                        .routePath("/banking")
                        .enabled(true)
                        .displayOrder(1)
                        .build()
        );

        for (int i = 1; i <= 5; i++) {
            Customer c = new Customer();
            c.setFirstName("John" + i);
            c.setLastName("Doe");
            c.setEmail("john" + i + "@example.com");
            c.setSector(sector);
            customerRepository.save(c);
        }
    }

    @Test
    void shouldReturnPagedCustomers() throws Exception {

        SectorContext ctx = SectorContext.builder()
                .sectorId(sector.getId())
                .sectorCode("BANKING")
                .userId(1L)
                .userType(UserType.INDIVIDUAL)
                .roles(Set.of("ROLE_ADMIN"))
                .build();

        mockMvc.perform(
                        get("/api/v1/sectors/customers/paged")
                                .param("size", "2")
                                .requestAttr("sectorContext", ctx)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(2)))
                .andExpect(jsonPath("$.page").value(0))
                .andExpect(jsonPath("$.size").value(2))
                .andExpect(jsonPath("$.totalElements").value(5))
                .andExpect(jsonPath("$.totalPages").value(3))
                .andExpect(jsonPath("$.hasNext").value(true))
                .andExpect(jsonPath("$.hasPrevious").value(false));
    }
}
