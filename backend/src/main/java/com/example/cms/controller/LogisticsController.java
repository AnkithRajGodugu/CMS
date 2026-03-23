package com.example.cms.controller;

import com.example.cms.dto.ApiResponse;
import com.example.cms.entity.InventoryItem;
import com.example.cms.entity.Shipment;
import com.example.cms.entity.Vehicle;
import com.example.cms.entity.Route;
import com.example.cms.repository.InventoryItemRepository;
import com.example.cms.repository.ShipmentRepository;
import com.example.cms.repository.VehicleRepository;
import com.example.cms.repository.RouteRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logistics")
@PreAuthorize("hasRole('ADMIN') or hasRole('LOGISTICS') or hasRole('logistics')")
@RequiredArgsConstructor
@Tag(name = "Logistics Management", description = "Endpoints for managing shipments, inventory, fleet and routes")
public class LogisticsController {

    private final ShipmentRepository shipmentRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final VehicleRepository vehicleRepository;
    private final RouteRepository routeRepository;

    // --- Shipments ---
    @GetMapping("/shipments")
    @Operation(summary = "Get all shipments")
    public ApiResponse<List<Shipment>> getAllShipments() {
        return ApiResponse.success(shipmentRepository.findAll());
    }

    @PostMapping("/shipments")
    @Operation(summary = "Create a new shipment")
    public ApiResponse<Shipment> createShipment(@RequestBody Shipment shipment) {
        return ApiResponse.success("Shipment created successfully", shipmentRepository.save(shipment));
    }

    @GetMapping("/shipments/{id}")
    @Operation(summary = "Get shipment by ID")
    public ResponseEntity<ApiResponse<Shipment>> getShipmentById(@PathVariable Long id) {
        return shipmentRepository.findById(id)
                .map(shipment -> ResponseEntity.ok(ApiResponse.success(shipment)))
                .orElse(ResponseEntity.notFound().build());
    }

    // --- Inventory ---
    @GetMapping("/inventory")
    @Operation(summary = "Get all inventory items")
    public ApiResponse<List<InventoryItem>> getAllInventory() {
        return ApiResponse.success(inventoryItemRepository.findAll());
    }

    @PostMapping("/inventory")
    @Operation(summary = "Create a new inventory item")
    public ApiResponse<InventoryItem> createInventoryItem(@RequestBody InventoryItem item) {
        return ApiResponse.success("Inventory item created successfully", inventoryItemRepository.save(item));
    }

    // --- Fleet (Vehicles) ---
    @GetMapping("/vehicles")
    @Operation(summary = "Get all vehicles in the fleet")
    public ApiResponse<List<Vehicle>> getAllVehicles() {
        return ApiResponse.success(vehicleRepository.findAll());
    }

    @PostMapping("/vehicles")
    @Operation(summary = "Add a new vehicle to the fleet")
    public ApiResponse<Vehicle> createVehicle(@RequestBody Vehicle vehicle) {
        return ApiResponse.success("Vehicle added to fleet", vehicleRepository.save(vehicle));
    }

    @GetMapping("/vehicles/{id}")
    @Operation(summary = "Get vehicle by ID")
    public ResponseEntity<ApiResponse<Vehicle>> getVehicleById(@PathVariable Long id) {
        return vehicleRepository.findById(id)
                .map(v -> ResponseEntity.ok(ApiResponse.success(v)))
                .orElse(ResponseEntity.notFound().build());
    }

    // --- Routes (Optimization) ---
    @GetMapping("/routes")
    @Operation(summary = "Get all optimized routes")
    public ApiResponse<List<Route>> getAllRoutes() {
        return ApiResponse.success(routeRepository.findAll());
    }

    @PostMapping("/routes")
    @Operation(summary = "Create a new optimized route")
    public ApiResponse<Route> createRoute(@RequestBody Route route) {
        return ApiResponse.success("Route created successfully", routeRepository.save(route));
    }

    @GetMapping("/routes/{id}")
    @Operation(summary = "Get route by ID")
    public ResponseEntity<ApiResponse<Route>> getRouteById(@PathVariable Long id) {
        return routeRepository.findById(id)
                .map(r -> ResponseEntity.ok(ApiResponse.success(r)))
                .orElse(ResponseEntity.notFound().build());
    }
}
