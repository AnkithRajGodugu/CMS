package com.example.cms.controller;

import com.example.cms.entity.InventoryItem;
import com.example.cms.entity.Shipment;
import com.example.cms.repository.InventoryItemRepository;
import com.example.cms.repository.ShipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logistics")
@PreAuthorize("hasRole('ADMIN') or hasRole('LOGISTICS') or hasRole('logistics')")
public class LogisticsController {

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    private InventoryItemRepository inventoryItemRepository;

    // --- Shipments ---
    @GetMapping("/shipments")
    public List<Shipment> getAllShipments() {
        return shipmentRepository.findAll();
    }

    @PostMapping("/shipments")
    public Shipment createShipment(@RequestBody Shipment shipment) {
        return shipmentRepository.save(shipment);
    }

    @GetMapping("/shipments/{id}")
    public ResponseEntity<Shipment> getShipmentById(@PathVariable Long id) {
        return shipmentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/shipments/{id}")
    public ResponseEntity<Shipment> updateShipment(@PathVariable Long id, @RequestBody Shipment updated) {
        return shipmentRepository.findById(id)
                .map(shipment -> {
                    shipment.setOrigin(updated.getOrigin());
                    shipment.setDestination(updated.getDestination());
                    shipment.setStatus(updated.getStatus());
                    shipment.setWeight(updated.getWeight());
                    shipment.setEstimatedDelivery(updated.getEstimatedDelivery());
                    return ResponseEntity.ok(shipmentRepository.save(shipment));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // --- Inventory ---
    @GetMapping("/inventory")
    public List<InventoryItem> getAllInventory() {
        return inventoryItemRepository.findAll();
    }

    @PostMapping("/inventory")
    public InventoryItem createInventoryItem(@RequestBody InventoryItem item) {
        return inventoryItemRepository.save(item);
    }

    @GetMapping("/inventory/{id}")
    public ResponseEntity<InventoryItem> getInventoryById(@PathVariable Long id) {
        return inventoryItemRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/inventory/{id}")
    public ResponseEntity<InventoryItem> updateInventoryItem(@PathVariable Long id, @RequestBody InventoryItem updated) {
        return inventoryItemRepository.findById(id)
                .map(item -> {
                    item.setProductName(updated.getProductName());
                    item.setQuantity(updated.getQuantity());
                    item.setReorderPoint(updated.getReorderPoint());
                    item.setWarehouseLocation(updated.getWarehouseLocation());
                    if (updated.getLastRestocked() != null) {
                        item.setLastRestocked(updated.getLastRestocked());
                    }
                    // Quantity trigger updateStatus
                    return ResponseEntity.ok(inventoryItemRepository.save(item));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
