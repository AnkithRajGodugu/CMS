package com.example.cms;

import com.example.cms.model.SectorContext;
import com.example.cms.service.AuditService;
import com.example.cms.service.CustomerService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false) // 🔥 disables ALL filters
class CustomerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CustomerService customerService;

    @MockBean
    private AuditService auditService;

    @Test
    void getAll_shouldReturn200() throws Exception {

        SectorContext ctx = SectorContext.builder()
                .sectorId(1L)
                .build();

        when(customerService.getAllCustomers(any()))
                .thenReturn(List.of());

        mockMvc.perform(
                        get("/api/sectors/customers")
                                .requestAttr("sectorContext", ctx)
                )
                .andExpect(status().isOk());
    }
}
