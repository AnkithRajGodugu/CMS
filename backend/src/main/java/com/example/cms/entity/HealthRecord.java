package com.example.cms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "health_records")
@SQLDelete(sql = "UPDATE health_records SET deleted = true WHERE id=?")
@SQLRestriction("deleted = false")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class HealthRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @NotNull(message = "Record type is required")
    @Enumerated(EnumType.STRING)
    private RecordType type;

    @NotNull(message = "Record date is required")
    private LocalDate recordDate;

    @NotNull(message = "Title is required")
    private String title;

    private String provider;
    
    private String status; // e.g. "Normal Range", "Visit Summary"
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String attachmentUrl;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "deleted", nullable = false)
    private boolean deleted = false;

    public enum RecordType {
        LAB_RESULT, VISIT_SUMMARY, IMAGING, VACCINATION, PRESCRIPTION
    }

    public HealthRecord() {}

    public HealthRecord(User user, RecordType type, LocalDate recordDate, String title, String provider, String status, String description) {
        this.user = user;
        this.type = type;
        this.recordDate = recordDate;
        this.title = title;
        this.provider = provider;
        this.status = status;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    @JsonIgnore
    public User getUser() { return user; }

    public String getUsername() { return user != null ? user.getUsername() : null; }
    public void setUser(User user) { this.user = user; }

    public RecordType getType() { return type; }
    public void setType(RecordType type) { this.type = type; }

    public LocalDate getRecordDate() { return recordDate; }
    public void setRecordDate(LocalDate recordDate) { this.recordDate = recordDate; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAttachmentUrl() { return attachmentUrl; }
    public void setAttachmentUrl(String attachmentUrl) { this.attachmentUrl = attachmentUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }
}
