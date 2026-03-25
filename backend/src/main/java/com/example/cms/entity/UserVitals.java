package com.example.cms.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "user_vitals")
@SQLDelete(sql = "UPDATE user_vitals SET deleted = true WHERE id=?")
@SQLRestriction("deleted = false")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class UserVitals {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String bloodPressure;
    private String heartRate;
    private String weight;
    private String temperature;

    private LocalDateTime lastUpdated = LocalDateTime.now();

    @Column(name = "deleted", nullable = false)
    private boolean deleted = false;

    public UserVitals() {}

    public UserVitals(User user, String bloodPressure, String heartRate, String weight, String temperature) {
        this.user = user;
        this.bloodPressure = bloodPressure;
        this.heartRate = heartRate;
        this.weight = weight;
        this.temperature = temperature;
        this.lastUpdated = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getBloodPressure() { return bloodPressure; }
    public void setBloodPressure(String bloodPressure) { this.bloodPressure = bloodPressure; }

    public String getHeartRate() { return heartRate; }
    public void setHeartRate(String heartRate) { this.heartRate = heartRate; }

    public String getWeight() { return weight; }
    public void setWeight(String weight) { this.weight = weight; }

    public String getTemperature() { return temperature; }
    public void setTemperature(String temperature) { this.temperature = temperature; }

    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }

    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }

    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
    }
}
