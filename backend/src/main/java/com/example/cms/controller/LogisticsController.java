package com.example.cms.controller;

import com.example.cms.dto.ApiResponse;
import com.example.cms.entity.InventoryItem;
import com.example.cms.entity.Shipment;
import com.example.cms.entity.Vehicle;
import com.example.cms.entity.Route;
import com.example.cms.entity.User;
import com.example.cms.entity.ShipmentEvent;
import com.example.cms.entity.Vendor;
import com.example.cms.repository.InventoryItemRepository;
import com.example.cms.repository.ShipmentRepository;
import com.example.cms.repository.VehicleRepository;
import com.example.cms.repository.RouteRepository;
import com.example.cms.repository.UserRepository;
import com.example.cms.repository.ShipmentEventRepository;
import com.example.cms.repository.VendorRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;

@RestController
@RequestMapping("/api/logistics")
@PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('USER') or hasRole('LOGISTICS') or hasRole('logistics')")
@RequiredArgsConstructor
@Tag(name = "Logistics Management", description = "Endpoints for managing shipments, inventory, fleet and routes")
public class LogisticsController {

    private final ShipmentRepository shipmentRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final VehicleRepository vehicleRepository;
    private final RouteRepository routeRepository;
    private final UserRepository userRepository;
    private final ShipmentEventRepository shipmentEventRepository;
    private final VendorRepository vendorRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
            return null;
        }

        Object principal = auth.getPrincipal();
        if (principal instanceof com.example.cms.security.CustomUserDetails customUserDetails) {
            return customUserDetails.getUser();
        }

        return null;
    }

    @GetMapping("/my-dashboard")
    @Operation(summary = "Get current user's logistics dashboard stats")
    public ApiResponse<Map<String, Object>> getMyDashboard() {
        User user = getCurrentUser();
        if (user == null) return ApiResponse.error("User not found");

        Map<String, Object> stats = new HashMap<>();
        Page<Shipment> userPage = shipmentRepository.findByUser(user, Pageable.unpaged());
        List<Shipment> shipments = userPage.getContent();

        stats.put("totalShipments", shipments.size());
        stats.put("inTransit", shipments.stream().filter(s -> s.getStatus() == Shipment.ShipmentStatus.IN_TRANSIT).count());
        stats.put("delivered", shipments.stream().filter(s -> s.getStatus() == Shipment.ShipmentStatus.DELIVERED).count());
        stats.put("pending", shipments.stream().filter(s -> s.getStatus() == Shipment.ShipmentStatus.PENDING).count());

        return ApiResponse.success(stats);
    }

    @GetMapping("/my-shipments")
    @Operation(summary = "Get current user's shipments")
    public ApiResponse<Page<Shipment>> getMyShipments(@PageableDefault(size = 20) Pageable pageable) {
        User user = getCurrentUser();
        if (user == null) return ApiResponse.error("User not found");
        return ApiResponse.success(shipmentRepository.findByUser(user, pageable));
    }

    // --- Shipments ---
    @GetMapping("/shipments")
    @Operation(summary = "Get all shipments")
    public ApiResponse<Page<Shipment>> getAllShipments(@PageableDefault(size = 20) Pageable pageable) {
        return ApiResponse.success(shipmentRepository.findAll(pageable));
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

    @GetMapping("/shipments/track/{trackingId}")
    @Operation(summary = "Track shipment by tracking ID")
    public ApiResponse<Map<String, Object>> trackShipment(@PathVariable String trackingId) {
        Shipment shipment = shipmentRepository.findByTrackingId(trackingId).orElse(null);
        if (shipment == null) {
            return ApiResponse.error("Shipment not found");
        }
        List<ShipmentEvent> events = shipmentEventRepository.findByShipmentIdOrderByTimestampDesc(shipment.getId());
        Map<String, Object> result = new HashMap<>();
        result.put("status", shipment.getStatus());
        result.put("origin", shipment.getOrigin());
        result.put("destination", shipment.getDestination());
        result.put("events", events);
        return ApiResponse.success(result);
    }

    // --- Inventory ---
    @GetMapping("/inventory")
    @Operation(summary = "Get all inventory items")
    public ApiResponse<Page<InventoryItem>> getAllInventory(@PageableDefault(size = 20) Pageable pageable) {
        return ApiResponse.success(inventoryItemRepository.findAll(pageable));
    }

    @PostMapping("/inventory")
    @Operation(summary = "Create a new inventory item")
    public ApiResponse<InventoryItem> createInventoryItem(@RequestBody InventoryItem item) {
        return ApiResponse.success("Inventory item created successfully", inventoryItemRepository.save(item));
    }

    // --- Fleet (Vehicles) ---
    @GetMapping("/vehicles")
    @Operation(summary = "Get all vehicles in the fleet")
    public ApiResponse<Page<Vehicle>> getAllVehicles(@PageableDefault(size = 20) Pageable pageable) {
        return ApiResponse.success(vehicleRepository.findAll(pageable));
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
    public ApiResponse<Page<Route>> getAllRoutes(@PageableDefault(size = 20) Pageable pageable) {
        return ApiResponse.success(routeRepository.findAll(pageable));
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

    // --- Vendors ---
    @GetMapping("/vendors")
    @Operation(summary = "Get all vendors")
    public ApiResponse<List<Vendor>> getAllVendors() {
        return ApiResponse.success(vendorRepository.findAll());
    }

    @PostMapping("/vendors")
    @Operation(summary = "Add a new vendor")
    public ApiResponse<Vendor> createVendor(@RequestBody Vendor vendor) {
        return ApiResponse.success("Vendor added successfully", vendorRepository.save(vendor));
    }
}
