package com.example.cms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification", indexes = {
    @Index(name = "idx_notif_user_read", columnList = "user_id, read"),
    @Index(name = "idx_notif_created_at", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    @Builder.Default
    private NotificationType type = NotificationType.SYSTEM;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false)
    @Builder.Default
    private Boolean read = false;

    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    /** Optional deep-link for the notification (e.g. /user/banking/transactions) */
    @Column(length = 512)
    private String link;

    public enum NotificationType {
        APPOINTMENT, TRANSACTION, CLAIM, SYSTEM, SECURITY
    }
}
