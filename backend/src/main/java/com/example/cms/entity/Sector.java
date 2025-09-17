// New Sector.java
package com.example.cms.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "sectors")
public class Sector {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;
}