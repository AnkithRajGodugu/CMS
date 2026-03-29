package com.example.cms.controller;

import com.example.cms.dto.ApiResponse;
import com.example.cms.entity.ContentAsset;
import com.example.cms.entity.Project;
import com.example.cms.entity.User;
import com.example.cms.repository.ContentAssetRepository;
import com.example.cms.repository.ProjectRepository;
import com.example.cms.repository.UserRepository;
import com.example.cms.repository.ContentDistributionRepository;
import com.example.cms.entity.ContentDistribution;
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
@PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('USER') or hasRole('CONTENT') or hasRole('content')")
@RequiredArgsConstructor
@Tag(name = "Content Management", description = "Endpoints for managing projects and content assets")
public class ContentController {

    private final ProjectRepository projectRepository;
    private final ContentAssetRepository contentAssetRepository;
    private final UserRepository userRepository;
    private final ContentDistributionRepository contentDistributionRepository;

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

    // --- Distribution ---
    @GetMapping("/distribution")
    @Operation(summary = "Get distribution channel status")
    public ApiResponse<List<ContentDistribution>> getDistributionStatus() {
        return ApiResponse.success(contentDistributionRepository.findAll());
    }

    @GetMapping("/analytics/summary")
    @Operation(summary = "Get high-level content analytics")
    public ApiResponse<Map<String, Object>> getAnalyticsSummary() {
        Map<String, Object> stats = new HashMap<>();
        
        long activeCampaigns = contentDistributionRepository.findAll().stream()
                .mapToLong(d -> d.getActiveCampaigns() != null ? d.getActiveCampaigns() : 0)
                .sum();
                
        stats.put("totalProjects", projectRepository.count());
        stats.put("totalAssets", contentAssetRepository.count());
        stats.put("activeCampaigns", activeCampaigns);
        
        // Retain some mock data for fields that don't have a backend equivalent yet
        stats.put("totalViews", "45.8M");
        stats.put("avgEngagement", "4.2%");
        stats.put("growthRate", "+12.5%");
        
        return ApiResponse.success(stats);
    }

    // --- Admin Dashboard Stats ---
    @GetMapping("/dashboard/stats")
    @Operation(summary = "Get admin content dashboard summary stats")
    public ApiResponse<Map<String, Object>> getAdminDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        List<Project> allProjects = projectRepository.findAll();
        long activeProjects  = allProjects.stream().filter(p -> p.getStatus() == Project.ProjectStatus.IN_PROGRESS).count();
        long completedProjects = allProjects.stream().filter(p -> p.getStatus() == Project.ProjectStatus.COMPLETED).count();
        long onHoldProjects  = allProjects.stream().filter(p -> p.getStatus() == Project.ProjectStatus.ON_HOLD).count();
        long reviewProjects  = allProjects.stream().filter(p -> p.getStatus() == Project.ProjectStatus.REVIEW).count();
        long totalClients    = allProjects.stream().map(Project::getClientName).filter(c -> c != null).distinct().count();

        stats.put("totalProjects",     allProjects.size());
        stats.put("activeProjects",    activeProjects);
        stats.put("completedProjects", completedProjects);
        stats.put("onHoldProjects",    onHoldProjects);
        stats.put("reviewProjects",    reviewProjects);
        stats.put("totalClients",      totalClients);

        List<ContentAsset> allAssets = contentAssetRepository.findAll();
        stats.put("totalAssets", allAssets.size());
        stats.put("imageAssets",    allAssets.stream().filter(a -> a.getType() == ContentAsset.AssetType.IMAGE).count());
        stats.put("videoAssets",    allAssets.stream().filter(a -> a.getType() == ContentAsset.AssetType.VIDEO).count());
        stats.put("documentAssets", allAssets.stream().filter(a -> a.getType() == ContentAsset.AssetType.DOCUMENT).count());

        long activeCampaigns = contentDistributionRepository.findAll().stream()
                .mapToLong(d -> d.getActiveCampaigns() != null ? d.getActiveCampaigns() : 0).sum();
        stats.put("activeCampaigns", activeCampaigns);

        return ApiResponse.success(stats);
    }

    @GetMapping("/projects/{projectId}/assets")
    @Operation(summary = "Get all assets for a specific project")
    public ApiResponse<List<ContentAsset>> getAssetsByProject(@PathVariable Long projectId) {
        return ApiResponse.success(contentAssetRepository.findByProjectId(projectId));
    }
}
