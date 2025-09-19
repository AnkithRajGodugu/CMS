package com.example.cms.controller;

import com.example.cms.repository.UserRepository;
import com.example.cms.repository.SectorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SectorRepository sectorRepository;

    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("message", "CMS Backend is running");
        status.put("timestamp", System.currentTimeMillis());
        
        try {
            status.put("userCount", userRepository.count());
            status.put("sectorCount", sectorRepository.count());
        } catch (Exception e) {
            status.put("dbError", e.getMessage());
        }
        
        return status;
    }

    @GetMapping("/test")
    public Map<String, String> test() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Backend API is working!");
        response.put("version", "1.0.0");
        return response;
    }
}