package com.example.cms.repository;

import com.example.cms.entity.Customer;
import com.example.cms.entity.Sector;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Customer findByEmail(String email);

    List<Customer> findBySector(Sector sector);

    long countBySectorAndCreatedAtBetween(Sector sector, LocalDateTime start, LocalDateTime end);

    @Query("SELECT c FROM Customer c WHERE " +
           "(c.sector = :sector) and " +
           "(:name is null or lower(c.firstName) like lower(concat('%', :name, '%')) or lower(c.lastName) like lower(concat('%', :name, '%'))) and " +
           "(:email is null or lower(c.email) like lower(concat('%', :email, '%')))")
    List<Customer> searchCustomersInSector(@Param("sector") Sector sector, @Param("name") String name, @Param("email") String email);

    @Query("SELECT c FROM Customer c WHERE " +
            "(:name is null or lower(c.firstName) like lower(concat('%', :name, '%')) or lower(c.lastName) like lower(concat('%', :name, '%'))) and " +
            "(:email is null or lower(c.email) like lower(concat('%', :email, '%')))")
    List<Customer> searchAllCustomers(@Param("name") String name, @Param("email") String email);
}
