package com.example.cms.controller;

import com.example.cms.dto.ApiResponse;
import com.example.cms.entity.ContentAsset;
import com.example.cms.entity.Project;
import com.example.cms.entity.User;
import com.example.cms.repository.ContentAssetRepository;
import com.example.cms.repository.ProjectRepository;
import com.example.cms.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

@RestController
@RequestMapping("/api/content")
@PreAuthorize("hasRole('ADMIN') or hasRole('USER') or hasRole('CONTENT') or hasRole('content')")
@RequiredArgsConstructor
@Tag(name = "Content Management", description = "Endpoints for managing projects and content assets")
public class ContentController {

    private final ProjectRepository projectRepository;
    private final ContentAssetRepository contentAssetRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            return null;
        }

        Object principal = auth.getPrincipal();
        if (principal instanceof com.example.cms.security.CustomUserDetails customUserDetails) {
            return customUserDetails.getUser();
        }

        return null;
    }

    @GetMapping("/my-dashboard")
    @Operation(summary = "Get current user's content dashboard stats")
    public ApiResponse<Map<String, Object>> getMyDashboard() {
        User user = getCurrentUser();
        if (user == null) return ApiResponse.error("User not found");

        Map<String, Object> stats = new HashMap<>();
        Page<Project> projectsPage = projectRepository.findByUser(user, Pageable.unpaged());
        List<Project> projects = projectsPage.getContent();

        stats.put("totalProjects", projects.size());
        stats.put("activeProjects", projects.stream().filter(p -> p.getStatus() == Project.ProjectStatus.IN_PROGRESS).count());
        stats.put("completedProjects", projects.stream().filter(p -> p.getStatus() == Project.ProjectStatus.COMPLETED).count());
        
        Page<ContentAsset> assetsPage = contentAssetRepository.findByUser(user, Pageable.unpaged());
        stats.put("totalAssets", assetsPage.getTotalElements());

        return ApiResponse.success(stats);
    }

    @GetMapping("/my-projects")
    @Operation(summary = "Get current user's projects")
    public ApiResponse<Page<Project>> getMyProjects(@PageableDefault(size = 20) Pageable pageable) {
        User user = getCurrentUser();
        if (user == null) return ApiResponse.error("User not found");
        return ApiResponse.success(projectRepository.findByUser(user, pageable));
    }

    // --- Projects ---
    @GetMapping("/projects")
    @Operation(summary = "Get all projects")
    public ApiResponse<Page<Project>> getAllProjects(@PageableDefault(size = 20) Pageable pageable) {
        return ApiResponse.success(projectRepository.findAll(pageable));
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
    public ApiResponse<Page<ContentAsset>> getAllAssets(@PageableDefault(size = 20) Pageable pageable) {
        return ApiResponse.success(contentAssetRepository.findAll(pageable));
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
