package com.example.cms.repository;

import com.example.cms.entity.Organization;
import com.example.cms.entity.Sector;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    
    List<Organization> findBySector(Sector sector);
    
    List<Organization> findBySectorId(Long sectorId);
    
    org.springframework.data.domain.Page<Organization> findBySectorId(Long sectorId, org.springframework.data.domain.Pageable pageable);
    
    Optional<Organization> findByName(String name);
    
    List<Organization> findByActiveTrue();
    
    // Optimized query with fetch join to avoid N+1 problem
    @Query("SELECT o FROM Organization o " +
           "LEFT JOIN FETCH o.sector " +
           "WHERE o.id = :id")
    Optional<Organization> findByIdWithSector(@Param("id") Long id);
    
    // Optimized query for sector-based organization lookup
    @Query("SELECT o FROM Organization o " +
           "LEFT JOIN FETCH o.sector s " +
           "WHERE s.id = :sectorId AND o.active = true " +
           "ORDER BY o.name ASC")
    List<Organization> findActiveBySectorIdWithDetails(@Param("sectorId") Long sectorId);
    
    // Paginated query for large result sets
    @Query("SELECT o FROM Organization o " +
           "LEFT JOIN FETCH o.sector " +
           "WHERE o.active = true")
    Page<Organization> findAllActiveWithDetails(Pageable pageable);
    
    // Count query for performance metrics
    @Query("SELECT COUNT(o) FROM Organization o WHERE o.sector.id = :sectorId AND o.active = true")
    long countActiveBySectorId(@Param("sectorId") Long sectorId);
}
