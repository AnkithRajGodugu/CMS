package com.example.cms.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.example.cms.converter.EncryptedEmailConverter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "users", indexes = {
    @Index(name = "idx_users_sector_id", columnList = "sector_id"),
    @Index(name = "idx_users_organization_id", columnList = "organization_id"),
    @Index(name = "idx_users_username", columnList = "username"),
    @Index(name = "idx_users_email", columnList = "email"),
    @Index(name = "idx_users_enabled", columnList = "enabled"),
    @Index(name = "idx_users_sector_org", columnList = "sector_id, organization_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false, length = 1000)
    @Convert(converter = EncryptedEmailConverter.class)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_type", nullable = false)
    @Builder.Default
    private UserType userType = UserType.INDIVIDUAL;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sector_id") // nullable — user may not have a sector immediately after registration
    private Sector sector;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id")
    private Organization organization;

    // NOTE: roles are derived from the `role` enum above.
    // The redundant @ElementCollection user_roles table has been removed.

    @Column(nullable = false)
    @Builder.Default
    private boolean enabled = true;

    @Column(name = "email_verified", nullable = false)
    @Builder.Default
    private boolean emailVerified = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Column(name = "totp_secret", length = 64)
    private String totpSecret;

    @Column(name = "totp_enabled", nullable = false)
    @Builder.Default
    private boolean totpEnabled = false;

    // Feature #8: Enhanced Profiles
    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "bio", length = 500)
    private String bio;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "preferences", columnDefinition = "text")
    private String preferences; // Store JSON as text for simplicity, or use native JSONB if PostgreSQL specific config is added.

    public enum Role {
        ADMIN, MANAGER, USER, SUPERADMIN
    }

    // Backward compatibility constructor
    public User(String username, String password, Role role) {
        this.username = username;
        this.email = username + "@example.com"; // Generate default email
        this.password = password;
        this.role = role;
        this.userType = UserType.INDIVIDUAL;
        this.enabled = true;
        this.emailVerified = true; // explicitly verify legacy backend users
        this.createdAt = LocalDateTime.now();
    }
}