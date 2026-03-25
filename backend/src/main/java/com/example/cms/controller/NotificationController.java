package com.example.cms.controller;

import com.example.cms.entity.Notification;
import com.example.cms.entity.User;
import com.example.cms.service.NotificationService;
import com.example.cms.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final AuthService authService;

    /**
     * GET /api/notifications?page=0&size=20&unreadOnly=false
     * Returns paginated notifications for the authenticated user.
     */
    @GetMapping
    public ResponseEntity<?> getNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "false") boolean unreadOnly) {

        Long userId = getCurrentUserId();
        if (userId == null) return ResponseEntity.status(401).body(Map.of("success", false, "message", "Unauthorized"));

        Page<Notification> notificationsPage = unreadOnly
                ? notificationService.getUnreadNotificationsForUser(userId, page, size)
                : notificationService.getNotificationsForUser(userId, page, size);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("notifications", notificationsPage.getContent());
        response.put("totalElements", notificationsPage.getTotalElements());
        response.put("totalPages", notificationsPage.getTotalPages());
        response.put("unreadCount", notificationService.getUnreadCount(userId));
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/notifications/unread-count
     */
    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount() {
        Long userId = getCurrentUserId();
        if (userId == null) return ResponseEntity.status(401).body(Map.of("success", false));
        return ResponseEntity.ok(Map.of("success", true, "count", notificationService.getUnreadCount(userId)));
    }

    /**
     * POST /api/notifications/{id}/read
     */
    @PostMapping("/{id}/read")
    public ResponseEntity<?> markRead(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        if (userId == null) return ResponseEntity.status(401).body(Map.of("success", false));
        boolean updated = notificationService.markRead(id, userId);
        return ResponseEntity.ok(Map.of("success", updated));
    }

    /**
     * POST /api/notifications/read-all
     */
    @PostMapping("/read-all")
    public ResponseEntity<?> markAllRead() {
        Long userId = getCurrentUserId();
        if (userId == null) return ResponseEntity.status(401).body(Map.of("success", false));
        int count = notificationService.markAllRead(userId);
        return ResponseEntity.ok(Map.of("success", true, "markedCount", count));
    }

    // ─── Helpers ───────────────────────────────────────────────────────────────

    private Long getCurrentUserId() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) return null;
            return authService.findByUsername(auth.getName())
                    .map(User::getId)
                    .orElse(null);
        } catch (Exception e) {
            log.error("Failed to get current user ID", e);
            return null;
        }
    }
}
