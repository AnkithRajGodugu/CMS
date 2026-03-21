package com.example.cms.repository;

import com.example.cms.dto.MonthlyCustomerCountResponse;
import com.example.cms.dto.SectorMonthlyCustomerCountResponse;
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
            LOWER(c.firstName) LIKE CONCAT('%', :search, '%') OR
            LOWER(c.lastName) LIKE CONCAT('%', :search, '%') OR
            LOWER(c.email) LIKE CONCAT('%', :search, '%')
      )
""")
    Page<Customer> findBySectorWithSearch(
            @Param("sectorId") Long sectorId,
            @Param("search") String search,
            Pageable pageable
    );

    /* ---------- Pagination + search + date range ---------- */

    @Query("""
    SELECT c FROM Customer c
    WHERE c.sector.id = :sectorId
      AND (
            :search = '' OR
            LOWER(c.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR
            LOWER(c.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR
            LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%'))
      )
      AND c.createdAt >= :from
      AND c.createdAt <= :to
""")
    Page<Customer> findBySectorWithSearchAndDateRange(
            @Param("sectorId") Long sectorId,
            @Param("search") String search,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            Pageable pageable
    );
    /* ---------- Reporting ---------- */

    long countBySectorAndCreatedAtBetween(
            Sector sector,
            LocalDateTime start,
            LocalDateTime end
    );

    /* ---------- Monthly report per sector ---------- */

    @Query("""
        select new com.example.cms.dto.MonthlyCustomerCountResponse(
            year(c.createdAt),
            month(c.createdAt),
            count(c.id)
        )
        from Customer c
        where c.sector.id = :sectorId
          and c.createdAt between :start and :end
        group by
            year(c.createdAt),
            month(c.createdAt)
        order by
            year(c.createdAt),
            month(c.createdAt)
    """)
    List<MonthlyCustomerCountResponse> getMonthlyCustomerCounts(
            @Param("sectorId") Long sectorId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    /* ---------- Monthly report all sectors (Admin) ---------- */

    @Query("""
        select new com.example.cms.dto.SectorMonthlyCustomerCountResponse(
            s.id,
            s.code,
            year(c.createdAt),
            month(c.createdAt),
            count(c.id)
        )
        from Customer c
        join c.sector s
        where c.createdAt between :start and :end
        group by
            s.id, s.code,
            year(c.createdAt),
            month(c.createdAt)
        order by
            s.code,
            year(c.createdAt),
            month(c.createdAt)
    """)
    List<SectorMonthlyCustomerCountResponse> getMonthlyCustomerCountsAllSectors(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

}
