package com.example.cms.controller;

import com.example.cms.entity.Sector;
import com.example.cms.repository.SectorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/public/sectors")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PublicSectorController {

    private final SectorRepository sectorRepository;

    @GetMapping
    @Cacheable(value = "publicSectors", unless = "#result == null")
    public ResponseEntity<List<Sector>> getEnabledSectors() {
        List<Sector> enabledSectors = sectorRepository.findByEnabledTrueOrderByDisplayOrderAsc();
        
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(1, TimeUnit.HOURS).cachePublic())
                .body(enabledSectors);
    }

    @GetMapping("/{code}")
    @Cacheable(value = "publicSector", key = "#code", unless = "#result == null")
    public ResponseEntity<Sector> getSectorByCode(@PathVariable String code) {
        return sectorRepository.findByCode(code)
                .filter(sector -> sector.isEnabled())
                .map(sector -> ResponseEntity.ok()
                        .cacheControl(CacheControl.maxAge(1, TimeUnit.HOURS).cachePublic())
                        .body(sector))
                .orElse(ResponseEntity.notFound().build());
    }
}
