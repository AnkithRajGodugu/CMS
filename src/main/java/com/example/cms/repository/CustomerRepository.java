// Updated CustomerRepository.java (added findBySector, countBySectorAndCreatedAtBetween, updated search queries)
package com.example.cms.repository;

import com.example.cms.entity.Customer;
import com.example.cms.entity.Sector;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    List<Customer> findByFirstNameContainingOrLastNameContaining(String firstName, String lastName);

    @Query("SELECT c FROM Customer c WHERE c.email LIKE %:email%")
    List<Customer> findByEmailContaining(@Param("email") String email);

    List<Customer> findBySector(Sector sector);

    long countBySectorAndCreatedAtBetween(Sector sector, LocalDateTime start, LocalDateTime end);
}