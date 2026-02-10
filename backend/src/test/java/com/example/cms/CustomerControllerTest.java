package com.example.cms;

import com.example.cms.config.NoSecurityConfig;
import com.example.cms.config.TestCacheConfig;
import com.example.cms.config.TestKafkaConfig;
import com.example.cms.config.TestKafkaDisableConfig;
import com.example.cms.model.SectorContext;
import com.example.cms.service.CustomerService;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")

@Import({
        NoSecurityConfig.class,
        TestKafkaConfig.class,

        TestKafkaDisableConfig.class
})
class CustomerControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    CustomerService customerService;

    @Test
    void getAll_shouldReturn200() throws Exception {

        SectorContext ctx = SectorContext.builder()
                .sectorId(1L)
                .build();

        when(customerService.getAllCustomers(any()))
                .thenReturn(List.of());

        mockMvc.perform(
                        get("/api/v1/sectors/customers")
                                .requestAttr("sectorContext", ctx)
                )
                .andExpect(status().isOk());
    }
}
