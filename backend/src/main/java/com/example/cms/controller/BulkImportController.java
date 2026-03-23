package com.example.cms.controller;

import com.example.cms.model.SectorContext;
import com.example.cms.service.BulkImportService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/import")
@RequiredArgsConstructor
public class BulkImportController {

    private final BulkImportService bulkImportService;

    @PostMapping("/customers/excel")
    public ResponseEntity<?> importCustomers(
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request) {
        
        SectorContext ctx = (SectorContext) request.getAttribute("sectorContext");
        if (ctx == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Sector context is required"));
        }

        try {
            int count = bulkImportService.importCustomersFromExcel(file, ctx);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Successfully imported " + count + " customers",
                "count", count
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
}
