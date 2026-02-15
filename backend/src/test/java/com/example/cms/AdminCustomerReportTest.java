package com.example.cms;

import com.example.cms.config.NoSecurityConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")

@Import({
        NoSecurityConfig.class,

})
class AdminCustomerReportTest {

    @Autowired
    MockMvc mockMvc;

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldAllowAdminCrossSectorReport() throws Exception {
        mockMvc.perform(
                        get("/api/v1/sectors/customers/reports/admin/monthly")
                                .param("start", "2026-01-01")
                                .param("end", "2026-12-31")
                )
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "USER")
    void shouldRejectNonAdminAccess() throws Exception {
        mockMvc.perform(
                        get("/api/v1/sectors/customers/reports/admin/monthly")
                                .param("start", "2026-01-01")
                                .param("end", "2026-12-31")
                )
                .andExpect(status().isForbidden());
    }
}
