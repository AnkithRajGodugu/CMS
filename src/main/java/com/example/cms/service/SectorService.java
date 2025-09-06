// New SectorService.java
package com.example.cms.service;

import com.example.cms.entity.Sector;
import com.example.cms.repository.SectorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SectorService {

    @Autowired
    private SectorRepository sectorRepository;

    public Sector createSector(Sector sector) {
        return sectorRepository.save(sector);
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
            return sectorRepository.save(sector);
        });
    }

    public boolean deleteSector(Long id) {
        Optional<Sector> sectorOpt = sectorRepository.findById(id);
        if (sectorOpt.isPresent()) {
            Sector sector = sectorOpt.get();
            sectorRepository.clearUserSectorReferences(sector);
            sectorRepository.clearCustomerSectorReferences(sector);
            sectorRepository.deleteById(id);
            return true;
        }
        return false;
    }
}