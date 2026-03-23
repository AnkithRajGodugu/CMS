package com.example.cms.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryItem {

    public enum InventoryStatus {
        IN_STOCK, LOW_STOCK, OUT_OF_STOCK, DISCONTINUED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sku", unique = true, nullable = false)
    private String sku;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "reorder_point")
    private Integer reorderPoint;

    @Column(name = "warehouse_location")
    private String warehouseLocation;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private InventoryStatus status;

    @Column(name = "last_restocked")
    private LocalDateTime lastRestocked;

    @PrePersist
    @PreUpdate
    public void updateStatus() {
        if (quantity != null && quantity <= 0) {
            this.status = InventoryStatus.OUT_OF_STOCK;
        } else if (quantity != null && reorderPoint != null && quantity <= reorderPoint) {
            this.status = InventoryStatus.LOW_STOCK;
        } else {
            this.status = InventoryStatus.IN_STOCK;
        }
    }
}
