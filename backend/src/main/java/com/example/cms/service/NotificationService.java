package com.example.cms.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Send a notification to all users in a specific sector
     */
    public void sendSectorNotification(String sectorCode, String type, String message, Map<String, Object> data) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("type", type);
        payload.put("message", message);
        payload.put("data", data);
        payload.put("timestamp", LocalDateTime.now().toString());

        String destination = "/topic/" + sectorCode.toLowerCase() + "/updates";
        messagingTemplate.convertAndSend(destination, payload);
        
        log.debug("Sent notification to {}: {}", destination, message);
    }

    /**
     * Send a notification to a specific user
     */
    public void sendUserNotification(String username, String type, String message, Map<String, Object> data) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("type", type);
        payload.put("message", message);
        payload.put("data", data);
        payload.put("timestamp", LocalDateTime.now().toString());

        messagingTemplate.convertAndSendToUser(username, "/queue/notifications", payload);
        
        log.debug("Sent private notification to user {}: {}", username, message);
    }
}
