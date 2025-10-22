package com.example.cms.repository;

import com.example.cms.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    
    // Find audit logs by user ID with pagination
    Page<AuditLog> findByUserId(Long userId, Pageable pageable);
    
    // Find audit logs by sector ID with pagination
    Page<AuditLog> findBySectorId(Long sectorId, Pageable pageable);
    
    // Find audit logs by organization ID with pagination
    Page<AuditLog> findByOrganizationId(Long organizationId, Pageable pageable);
    
    // Find audit logs by action type
    @Query("SELECT a FROM AuditLog a WHERE a.action = :action ORDER BY a.timestamp DESC")
    List<AuditLog> findByAction(@Param("action") String action);
    
    // Find audit logs by user and date range
    @Query("SELECT a FROM AuditLog a WHERE a.userId = :userId " +
           "AND a.timestamp BETWEEN :startDate AND :endDate " +
           "ORDER BY a.timestamp DESC")
    List<AuditLog> findByUserIdAndDateRange(
        @Param("userId") Long userId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    // Find audit logs by sector and date range
    @Query("SELECT a FROM AuditLog a WHERE a.sectorId = :sectorId " +
           "AND a.timestamp BETWEEN :startDate AND :endDate " +
           "ORDER BY a.timestamp DESC")
    List<AuditLog> findBySectorIdAndDateRange(
        @Param("sectorId") Long sectorId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    // Find authorization failures
    @Query("SELECT a FROM AuditLog a WHERE a.action LIKE '%UNAUTHORIZED%' " +
           "OR a.action LIKE '%FORBIDDEN%' " +
           "OR a.status = 'FAILURE' " +
           "ORDER BY a.timestamp DESC")
    List<AuditLog> findAuthorizationFailures();
    
    // Find recent audit logs by user
    @Query("SELECT a FROM AuditLog a WHERE a.userId = :userId " +
           "ORDER BY a.timestamp DESC")
    List<AuditLog> findRecentByUserId(@Param("userId") Long userId, Pageable pageable);
    
    // Count audit logs by action type
    @Query("SELECT COUNT(a) FROM AuditLog a WHERE a.action = :action")
    long countByAction(@Param("action") String action);
    
    // Count audit logs by user and date range
    @Query("SELECT COUNT(a) FROM AuditLog a WHERE a.userId = :userId " +
           "AND a.timestamp BETWEEN :startDate AND :endDate")
    long countByUserIdAndDateRange(
        @Param("userId") Long userId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    // Find audit logs by resource type and resource ID
    @Query("SELECT a FROM AuditLog a WHERE a.resourceType = :resourceType " +
           "AND a.resourceId = :resourceId " +
           "ORDER BY a.timestamp DESC")
    List<AuditLog> findByResourceTypeAndResourceId(
        @Param("resourceType") String resourceType,
        @Param("resourceId") String resourceId
    );
    
    // Find failed operations
    @Query("SELECT a FROM AuditLog a WHERE a.status = 'FAILURE' " +
           "AND a.timestamp >= :since " +
           "ORDER BY a.timestamp DESC")
    List<AuditLog> findFailedOperationsSince(@Param("since") LocalDateTime since);
    
    // Get error rate for monitoring
    @Query("SELECT COUNT(a) FROM AuditLog a WHERE a.status = 'FAILURE' " +
           "AND a.timestamp BETWEEN :startDate AND :endDate")
    long countFailuresByDateRange(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
}
