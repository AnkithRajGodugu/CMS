// New SectorService.java
package com.example.cms.service;

import com.example.cms.entity.Sector;
import com.example.cms.repository.SectorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class SectorService {

    private final SectorRepository sectorRepository;
    private final AuditService auditService;

    public Sector createSector(Sector sector) {
        Sector savedSector = sectorRepository.save(sector);
        
        // Log sector creation
        log.info("Sector created: {}", savedSector.getCode());
        auditService.logAction(null, savedSector.getId(), null, "SECTOR_CREATED", 
                "SECTOR", savedSector.getId().toString(), null, null);
        
        return savedSector;
    }

    public List<Sector> getAllSectors() {
        return sectorRepository.findAll();
    }

    public Optional<Sector> getSectorById(Long id) {
        return sectorRepository.findById(id);
    }

    public Optional<Sector> updateSector(Long id, Sector sectorDetails) {
        return sectorRepository.findById(id).map(sector -> {
            sector.setName(sectorDetails.getName());
            Sector updatedSector = sectorRepository.save(sector);
            
            // Log sector update
            log.info("Sector updated: {}", updatedSector.getCode());
            auditService.logAction(null, updatedSector.getId(), null, "SECTOR_UPDATED", 
                    "SECTOR", updatedSector.getId().toString(), null, null);
            
            return updatedSector;
        });
    }

    public boolean deleteSector(Long id) {
        Optional<Sector> sectorOpt = sectorRepository.findById(id);
        if (sectorOpt.isPresent()) {
            Sector sector = sectorOpt.get();
            
            // Note: In production, you'd want to handle foreign key constraints properly
            sectorRepository.deleteById(id);
            
            // Log sector deletion
            log.info("Sector deleted: {}", sector.getCode());
            auditService.logAction(null, sector.getId(), null, "SECTOR_DELETED", 
                    "SECTOR", sector.getId().toString(), null, null);
            
            return true;
        }
        return false;
    }
}