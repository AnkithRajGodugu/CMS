package com.example.cms.repository;

import com.example.cms.entity.Project;
import com.example.cms.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByStatus(Project.ProjectStatus status);
    List<Project> findByClientNameContainingIgnoreCase(String clientName);

    Page<Project> findByUser(User user, Pageable pageable);
}
