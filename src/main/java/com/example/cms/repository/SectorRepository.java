package com.example.cms.repository;

import com.example.cms.entity.Sector;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SectorRepository extends JpaRepository<Sector, Long> {
    Sector findByName(String name);

    @Modifying
    @Query("UPDATE User u SET u.sector = NULL WHERE u.sector = :sector")
    void clearUserSectorReferences(@Param("sector") Sector sector);

    @Modifying
    @Query("UPDATE Customer c SET c.sector = NULL WHERE c.sector = :sector")
    void clearCustomerSectorReferences(@Param("sector") Sector sector);
}