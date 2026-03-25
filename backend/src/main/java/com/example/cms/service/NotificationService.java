package com.example.cms.service;

import com.example.cms.entity.Notification;
import com.example.cms.entity.Notification.NotificationType;
import com.example.cms.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationRepository notificationRepository;

    // ─── Persistence ───────────────────────────────────────────────────────────

    /**
     * Persist a notification for a user AND push it live via WebSocket.
     */
    @Async
    @Transactional
    public void createAndSend(Long userId, String username,
                               NotificationType type, String title,
                               String message, String link) {
        try {
            Notification notification = Notification.builder()
                    .userId(userId)
                    .type(type)
                    .title(title)
                    .message(message)
                    .link(link)
                    .read(false)
                    .createdAt(LocalDateTime.now())
                    .build();

            Notification saved = notificationRepository.save(notification);

            // Push live via WebSocket private queue
            Map<String, Object> payload = buildPayload(saved);
            messagingTemplate.convertAndSendToUser(username, "/queue/notifications", payload);

            log.debug("Notification created and sent: userId={}, type={}, title={}", userId, type, title);
        } catch (Exception e) {
            log.error("Failed to create/send notification for userId={}", userId, e);
        }
    }

    /**
     * Persist a sector-wide notification and broadcast it on the sector topic.
     */
    @Async
    @Transactional
    public void createAndBroadcastToSector(String sectorCode, NotificationType type,
                                            String title, String message) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("type", type.name());
            payload.put("title", title);
            payload.put("message", message);
            payload.put("timestamp", LocalDateTime.now().toString());

            String destination = "/topic/" + sectorCode.toLowerCase() + "/updates";
            messagingTemplate.convertAndSend(destination, payload);

            log.debug("Sector notification broadcast to {}: {}", destination, title);
        } catch (Exception e) {
            log.error("Failed to broadcast sector notification to sectorCode={}", sectorCode, e);
        }
    }

    // ─── REST-backing queries ──────────────────────────────────────────────────

    public Page<Notification> getNotificationsForUser(Long userId, int page, int size) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(page, size));
    }

    public Page<Notification> getUnreadNotificationsForUser(Long userId, int page, int size) {
        return notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId, PageRequest.of(page, size));
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    @Transactional
    public boolean markRead(Long id, Long userId) {
        return notificationRepository.markReadByIdAndUserId(id, userId) > 0;
    }

    @Transactional
    public int markAllRead(Long userId) {
        return notificationRepository.markAllReadByUserId(userId);
    }

    // ─── Legacy compatibility (sector broadcast without persistence) ───────────

    public void sendSectorNotification(String sectorCode, String type, String message, Map<String, Object> data) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("type", type);
        payload.put("message", message);
        payload.put("data", data);
        payload.put("timestamp", LocalDateTime.now().toString());

        String destination = "/topic/" + sectorCode.toLowerCase() + "/updates";
        messagingTemplate.convertAndSend(destination, payload);
        log.debug("Sent legacy notification to {}: {}", destination, message);
    }

    public void sendUserNotification(String username, String type, String message, Map<String, Object> data) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("type", type);
        payload.put("message", message);
        payload.put("data", data);
        payload.put("timestamp", LocalDateTime.now().toString());

        messagingTemplate.convertAndSendToUser(username, "/queue/notifications", payload);
        log.debug("Sent legacy private notification to user {}: {}", username, message);
    }

    // ─── Helpers ───────────────────────────────────────────────────────────────

    private Map<String, Object> buildPayload(Notification n) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("id", n.getId());
        payload.put("type", n.getType().name());
        payload.put("title", n.getTitle());
        payload.put("message", n.getMessage());
        payload.put("read", n.getRead());
        payload.put("createdAt", n.getCreatedAt().toString());
        payload.put("link", n.getLink());
        return payload;
    }
}
