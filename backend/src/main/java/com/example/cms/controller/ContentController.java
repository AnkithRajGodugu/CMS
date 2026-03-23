package com.example.cms.controller;

import com.example.cms.dto.ApiResponse;
import com.example.cms.entity.ContentAsset;
import com.example.cms.entity.Project;
import com.example.cms.repository.ContentAssetRepository;
import com.example.cms.repository.ProjectRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/content")
@PreAuthorize("hasRole('ADMIN') or hasRole('CONTENT') or hasRole('content')")
@RequiredArgsConstructor
@Tag(name = "Content Management", description = "Endpoints for managing projects and content assets")
public class ContentController {

    private final ProjectRepository projectRepository;
    private final ContentAssetRepository contentAssetRepository;

    // --- Projects ---
    @GetMapping("/projects")
    @Operation(summary = "Get all projects")
    public ApiResponse<List<Project>> getAllProjects() {
        return ApiResponse.success(projectRepository.findAll());
    }

    @PostMapping("/projects")
    @Operation(summary = "Create a new project")
    public ApiResponse<Project> createProject(@RequestBody Project project) {
        return ApiResponse.success("Project created successfully", projectRepository.save(project));
    }

    @GetMapping("/projects/{id}")
    @Operation(summary = "Get project by ID")
    public ResponseEntity<ApiResponse<Project>> getProjectById(@PathVariable Long id) {
        return projectRepository.findById(id)
                .map(project -> ResponseEntity.ok(ApiResponse.success(project)))
                .orElse(ResponseEntity.notFound().build());
    }

    // --- Content Assets ---
    @GetMapping("/assets")
    @Operation(summary = "Get all content assets")
    public ApiResponse<List<ContentAsset>> getAllAssets() {
        return ApiResponse.success(contentAssetRepository.findAll());
    }

    @PostMapping("/assets")
    @Operation(summary = "Create a new content asset")
    public ApiResponse<ContentAsset> createAsset(@RequestBody ContentAsset asset) {
        if (asset.getProject() != null && asset.getProject().getId() != null) {
            Project parent = projectRepository.findById(asset.getProject().getId()).orElse(null);
            asset.setProject(parent);
        }
        return ApiResponse.success("Asset created successfully", contentAssetRepository.save(asset));
    }

    // --- Distribution (Generic/Mock data from backend) ---
    @GetMapping("/distribution")
    @Operation(summary = "Get distribution channel status")
    public ApiResponse<List<Map<String, Object>>> getDistributionStatus() {
        List<Map<String, Object>> platforms = List.of(
            Map.of("platform", "YouTube", "status", "CONNECTED", "followers", "1.2M", "activeCampaigns", 3),
            Map.of("platform", "Instagram", "status", "CONNECTED", "followers", "450K", "activeCampaigns", 5),
            Map.of("platform", "TikTok", "status", "DISCONNECTED", "followers", "890K", "activeCampaigns", 0),
            Map.of("platform", "Twitter/X", "status", "CONNECTED", "followers", "120K", "activeCampaigns", 2)
        );
        return ApiResponse.success(platforms);
    }

    // --- Analytics (Generic/Mock data from backend) ---
    @GetMapping("/analytics/summary")
    @Operation(summary = "Get high-level content analytics")
    public ApiResponse<Map<String, Object>> getAnalyticsSummary() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalViews", "45.8M");
        stats.put("avgEngagement", "4.2%");
        stats.put("growthRate", "+12.5%");
        stats.put("topPerformingProject", "Summer Brand Film 2026");
        return ApiResponse.success(stats);
    }

    @GetMapping("/projects/{projectId}/assets")
    @Operation(summary = "Get all assets for a specific project")
    public ApiResponse<List<ContentAsset>> getAssetsByProject(@PathVariable Long projectId) {
        return ApiResponse.success(contentAssetRepository.findByProjectId(projectId));
    }
}
