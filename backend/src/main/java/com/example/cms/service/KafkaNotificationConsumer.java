package com.example.cms.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaNotificationConsumer {

    private final SimpMessagingTemplate messagingTemplate;

    @KafkaListener(topics = "notification-events", groupId = "cms-notifications")
    public void handleNotification(String message) {
        broadcast("NOTIFICATION", message);
    }

    @KafkaListener(topics = "sector-events-banking", groupId = "cms-notifications")
    public void handleBankingEvent(String message) {
        broadcastToSector("BANKING", message);
    }

    @KafkaListener(topics = "sector-events-healthcare", groupId = "cms-notifications")
    public void handleHealthcareEvent(String message) {
        broadcastToSector("HEALTHCARE", message);
    }

    @KafkaListener(topics = "audit-events", groupId = "cms-notifications")
    public void handleAuditEvent(String message) {
        broadcast("AUDIT", message);
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    private void broadcast(String type, String payload) {
        try {
            Map<String, Object> envelope = buildEnvelope(type, payload);
            messagingTemplate.convertAndSend("/topic/notifications", envelope);
            log.debug("Broadcast {} event to /topic/notifications", type);
        } catch (Exception e) {
            log.warn("Could not broadcast notification: {}", e.getMessage());
        }
    }

    private void broadcastToSector(String sector, String payload) {
        try {
            Map<String, Object> envelope = buildEnvelope("SECTOR_EVENT", payload);
            envelope.put("sector", sector);
            messagingTemplate.convertAndSend("/topic/sector/" + sector.toLowerCase(), envelope);
            log.debug("Broadcast event to sector topic: {}", sector);
        } catch (Exception e) {
            log.warn("Could not broadcast sector event: {}", e.getMessage());
        }
    }

    private Map<String, Object> buildEnvelope(String type, String payload) {
        Map<String, Object> m = new HashMap<>();
        m.put("type", type);
        m.put("payload", payload);
        m.put("timestamp", LocalDateTime.now().toString());
        return m;
    }
}
