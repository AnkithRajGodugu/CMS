package com.example.cms.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_items")
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

    public InventoryItem() {}

    public InventoryItem(String sku, String productName, Integer quantity, Integer reorderPoint, String warehouseLocation) {
        this.sku = sku;
        this.productName = productName;
        this.quantity = quantity;
        this.reorderPoint = reorderPoint;
        this.warehouseLocation = warehouseLocation;
        updateStatus();
    }

    @PrePersist
    @PreUpdate
    public void updateStatus() {
        if (quantity <= 0) {
            this.status = InventoryStatus.OUT_OF_STOCK;
        } else if (reorderPoint != null && quantity <= reorderPoint) {
            this.status = InventoryStatus.LOW_STOCK;
        } else {
            this.status = InventoryStatus.IN_STOCK;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; updateStatus(); }
    public Integer getReorderPoint() { return reorderPoint; }
    public void setReorderPoint(Integer reorderPoint) { this.reorderPoint = reorderPoint; updateStatus(); }
    public String getWarehouseLocation() { return warehouseLocation; }
    public void setWarehouseLocation(String warehouseLocation) { this.warehouseLocation = warehouseLocation; }
    public InventoryStatus getStatus() { return status; }
    public void setStatus(InventoryStatus status) { this.status = status; }
    public LocalDateTime getLastRestocked() { return lastRestocked; }
    public void setLastRestocked(LocalDateTime lastRestocked) { this.lastRestocked = lastRestocked; }
}
