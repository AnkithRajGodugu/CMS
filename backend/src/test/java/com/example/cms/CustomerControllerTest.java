package com.example.cms;

import com.example.cms.model.SectorContext;
import com.example.cms.service.AuditService;
import com.example.cms.service.CustomerService;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class CustomerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CustomerService customerService;

    @MockBean
    private AuditService auditService;

    private SectorContext sector(HttpServletRequest request) {
        Object ctx = request.getAttribute("sectorContext");
        if (ctx == null) {
            throw new IllegalStateException("SectorContext missing from request");
        }
        return (SectorContext) ctx;
    }


    @Test
    void getAll_shouldReturn200() throws Exception {

        SectorContext ctx = SectorContext.builder()
                .sectorId(1L)
                .build();

        when(customerService.getAllCustomers(any()))
                .thenReturn(List.of());

        // ✅ CORRECT void-method stubbing
        doNothing().when(auditService).logDataAccess(
                any(),
                any(),
                any(),
                any(),
                any(),
                any(),
                any()
        );


        mockMvc.perform(
                        get("/api/v1/sectors/customers")
                                .requestAttr("sectorContext", ctx)
                )
                .andExpect(status().isOk());
    }
}
