package com.example.cms.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/logistics/tracking")
@RequiredArgsConstructor
@Slf4j
public class TrackingWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * REST endpoint used by delivery drivers/systems to update tracking coordinates.
     * Pushes the update to all actively subscribed WebSocket clients.
     */
    @PostMapping("/{trackingId}/update")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public void updateTracking(
            @PathVariable String trackingId,
            @RequestBody Map<String, Object> locationData
    ) {
        log.info("Received tracking update for {}: {}", trackingId, locationData);

        // Add server-side timestamp
        locationData.put("timestamp", LocalDateTime.now().toString());
        locationData.put("trackingId", trackingId);

        // Broadcast to all clients subscribed to this tracking ID
        messagingTemplate.convertAndSend("/topic/logistics/" + trackingId, locationData);
    }
    
    /**
     * Optional: This method handles messages sent directly from clients via WebSockets.
     * e.g., if a client sends a message to /app/tracking/{trackingId}/ping
     */
    @MessageMapping("/tracking/{trackingId}/ping")
    public void handleClientPing(@DestinationVariable String trackingId, Map<String, Object> payload) {
        log.info("Client pinged tracking {} with payload: {}", trackingId, payload);
        // Could echo back or handle interactive driver commands
    }
}
