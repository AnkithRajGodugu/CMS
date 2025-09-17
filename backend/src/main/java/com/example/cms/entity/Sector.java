package com.example.cms.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "sectors")
@Data
public class Sector {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    @OneToMany(mappedBy = "sector", cascade = CascadeType.ALL)
    private List<Customer> customers;

    @OneToMany(mappedBy = "sector", cascade = CascadeType.ALL)
    private List<User> managers;
}