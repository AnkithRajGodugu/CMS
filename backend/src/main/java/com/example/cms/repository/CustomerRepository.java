package com.example.cms.repository;

import com.example.cms.entity.Customer;
import com.example.cms.entity.Sector;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    /* ---------- Sector-based isolation ---------- */

    List<Customer> findBySector(Sector sector);

    List<Customer> findBySectorId(Long sectorId);

    Optional<Customer> findByIdAndSectorId(Long id, Long sectorId);

    boolean existsByIdAndSectorId(Long id, Long sectorId);

    /* ---------- Pagination + search ---------- */

    @Query("""
        SELECT c FROM Customer c
        WHERE c.sector.id = :sectorId
          AND (
                :search IS NULL OR
                LOWER(c.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR
                LOWER(c.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR
                LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%'))
          )
    """)
    Page<Customer> findBySectorWithSearch(
            @Param("sectorId") Long sectorId,
            @Param("search") String search,
            Pageable pageable
    );

    /* ---------- Reporting ---------- */

    long countBySectorAndCreatedAtBetween(
            Sector sector,
            LocalDateTime start,
            LocalDateTime end
    );
}
