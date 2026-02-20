package com.example.cms.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.example.cms.converter.EncryptedEmailConverter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sector_id")
    private Sector sector;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role_name")
    private Set<String> roles;

    @Column(nullable = false)
    @Builder.Default
    private boolean enabled = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    public enum Role {
        ADMIN, MANAGER, USER, BANKING, HEALTHCARE, LOGISTICS, CONTENT
    }

    // Backward compatibility constructor
    public User(String username, String password, Role role) {
        this.username = username;
        this.email = username + "@example.com"; // Generate default email
        this.password = password;
        this.role = role;
        this.userType = UserType.INDIVIDUAL;
        this.enabled = true;
        this.createdAt = LocalDateTime.now();
    }
}