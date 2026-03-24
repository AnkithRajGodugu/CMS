package com.example.cms.repository;

import com.example.cms.entity.Shipment;
import com.example.cms.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    Optional<Shipment> findByTrackingId(String trackingId);
    List<Shipment> findByStatus(Shipment.ShipmentStatus status);

    Page<Shipment> findByUser(User user, Pageable pageable);
}
