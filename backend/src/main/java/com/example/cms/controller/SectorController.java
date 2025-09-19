package com.example.cms.controller;

import com.example.cms.entity.Sector;
import com.example.cms.repository.SectorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sectors")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SectorController {

    private final SectorRepository sectorRepository;

    @GetMapping
    public ResponseEntity<List<Sector>> getAllSectors() {
        List<Sector> sectors = sectorRepository.findAll();
        return ResponseEntity.ok(sectors);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sector> getSectorById(@PathVariable Long id) {
        return sectorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Sector> createSector(@RequestBody Sector sector) {
        Sector savedSector = sectorRepository.save(sector);
        return ResponseEntity.ok(savedSector);
    }
}