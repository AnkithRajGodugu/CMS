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

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ContentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetAllProjects_WithPagination_ReturnsPagedResult() throws Exception {
        mockMvc.perform(get("/api/content/projects")
                .param("page", "0")
                .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.totalElements").exists())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetAllAssets_WithPagination_ReturnsPagedResult() throws Exception {
        mockMvc.perform(get("/api/content/assets")
                .param("page", "0")
                .param("size", "5"))
                .andDo(org.springframework.test.web.servlet.result.MockMvcResultHandlers.print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetDistributionStatus_ReturnsPlatformList() throws Exception {
        mockMvc.perform(get("/api/content/distribution"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetAnalyticsSummary_ReturnsStats() throws Exception {
        mockMvc.perform(get("/api/content/analytics/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalViews").exists())
                .andExpect(jsonPath("$.data.avgEngagement").exists());
    }

    @Test
    void testGetProjects_WithoutAuth_Returns401() throws Exception {
        mockMvc.perform(get("/api/content/projects"))
                .andExpect(status().isForbidden());
    }
}
