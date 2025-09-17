package com.example.cms.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
public class HealthController {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @GetMapping
    public Map<String, String> health() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "CMS Backend");
        
        try {
            // Simple Kafka connectivity test
            kafkaTemplate.send("health-check", "ping");
            status.put("kafka", "UP");
        } catch (Exception e) {
            status.put("kafka", "DOWN - " + e.getMessage());
        }
        
        return status;
    }
}