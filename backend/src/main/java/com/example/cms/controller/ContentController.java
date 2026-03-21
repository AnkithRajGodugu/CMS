package com.example.cms.controller;

import com.example.cms.entity.ContentAsset;
import com.example.cms.entity.Project;
import com.example.cms.repository.ContentAssetRepository;
import com.example.cms.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/content")
@PreAuthorize("hasRole('ADMIN') or hasRole('CONTENT') or hasRole('content')")
public class ContentController {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ContentAssetRepository contentAssetRepository;

    // --- Projects ---
    @GetMapping("/projects")
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @PostMapping("/projects")
    public Project createProject(@RequestBody Project project) {
        return projectRepository.save(project);
    }

    @GetMapping("/projects/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return projectRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/projects/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project updated) {
        return projectRepository.findById(id)
                .map(project -> {
                    project.setProjectName(updated.getProjectName());
                    project.setClientName(updated.getClientName());
                    project.setStatus(updated.getStatus());
                    project.setStartDate(updated.getStartDate());
                    project.setDeadline(updated.getDeadline());
                    project.setBudget(updated.getBudget());
                    return ResponseEntity.ok(projectRepository.save(project));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // --- Content Assets ---
    @GetMapping("/assets")
    public List<ContentAsset> getAllAssets() {
        return contentAssetRepository.findAll();
    }

    @PostMapping("/assets")
    public ContentAsset createAsset(@RequestBody ContentAsset asset) {
        if (asset.getProject() != null && asset.getProject().getId() != null) {
            Project parent = projectRepository.findById(asset.getProject().getId()).orElse(null);
            asset.setProject(parent);
        }
        return contentAssetRepository.save(asset);
    }

    @GetMapping("/assets/{id}")
    public ResponseEntity<ContentAsset> getAssetById(@PathVariable Long id) {
        return contentAssetRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/projects/{projectId}/assets")
    public List<ContentAsset> getAssetsByProject(@PathVariable Long projectId) {
        return contentAssetRepository.findByProjectId(projectId);
    }
}
