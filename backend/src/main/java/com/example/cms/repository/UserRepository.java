package com.example.cms.repository;

import com.example.cms.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    
    User findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    // Optimized query with fetch join to avoid N+1 problem
    @Query("SELECT u FROM User u " +
           "LEFT JOIN FETCH u.sector " +
           "LEFT JOIN FETCH u.organization " +
           "WHERE u.username = :username")
    Optional<User> findByUsernameWithDetails(@Param("username") String username);
    
    // Optimized query for sector-based user lookup
    @Query("SELECT u FROM User u " +
           "LEFT JOIN FETCH u.sector s " +
           "LEFT JOIN FETCH u.organization o " +
           "WHERE s.id = :sectorId AND u.enabled = true")
    List<User> findBySectorIdWithDetails(@Param("sectorId") Long sectorId);
    
    // Optimized query for organization-based user lookup
    @Query("SELECT u FROM User u " +
           "LEFT JOIN FETCH u.organization o " +
           "LEFT JOIN FETCH u.sector s " +
           "WHERE o.id = :organizationId AND u.enabled = true")
    List<User> findByOrganizationIdWithDetails(@Param("organizationId") Long organizationId);
    
    // Paginated query for large result sets
    @Query("SELECT u FROM User u " +
           "LEFT JOIN FETCH u.sector " +
           "LEFT JOIN FETCH u.organization " +
           "WHERE u.enabled = true")
    Page<User> findAllEnabledWithDetails(Pageable pageable);
    
    // Count queries for performance metrics
    @Query("SELECT COUNT(u) FROM User u WHERE u.sector.id = :sectorId AND u.enabled = true")
    long countBySectorIdAndEnabled(@Param("sectorId") Long sectorId);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.organization.id = :organizationId AND u.enabled = true")
    long countByOrganizationIdAndEnabled(@Param("organizationId") Long organizationId);
}