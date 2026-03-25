package com.example.cms;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.redisson.api.RedissonClient;
import javax.cache.CacheManager;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class HealthcareControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RedissonClient redissonClient;

    @MockBean(name = "jCacheManager")
    private CacheManager jCacheManager;

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetAllPatients_WithPagination_ReturnsPagedResult() throws Exception {
        mockMvc.perform(get("/api/sectors/healthcare/patients")
                .param("page", "0")
                .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.size").value(5))
                .andExpect(jsonPath("$.number").value(0))
                .andExpect(jsonPath("$.totalElements").exists());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetAllAppointments_WithPagination_ReturnsPagedResult() throws Exception {
        mockMvc.perform(get("/api/sectors/healthcare/appointments")
                .param("page", "0")
                .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.totalElements").exists());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetDashboardStats_ReturnsStats() throws Exception {
        mockMvc.perform(get("/api/sectors/healthcare/dashboard/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalPatients").exists())
                .andExpect(jsonPath("$.todaysAppointments").exists());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testSearchPatients_ReturnsMatchingResults() throws Exception {
        mockMvc.perform(get("/api/sectors/healthcare/patients/search")
                .param("query", "Sarah"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void testGetAllPatients_WithoutAuth_Returns401() throws Exception {
        mockMvc.perform(get("/api/sectors/healthcare/patients"))
                .andExpect(status().isForbidden());
    }
}
