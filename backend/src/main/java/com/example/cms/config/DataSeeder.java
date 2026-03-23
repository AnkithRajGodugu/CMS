package com.example.cms.config;

import com.example.cms.entity.*;
import com.example.cms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final InventoryItemRepository inventoryItemRepository;
    private final ShipmentRepository shipmentRepository;
    private final VehicleRepository vehicleRepository;
    private final RouteRepository routeRepository;
    private final ProjectRepository projectRepository;
    private final ContentAssetRepository contentAssetRepository;

    @Override
    public void run(String... args) throws Exception {
        if (inventoryItemRepository.count() == 0) {
            seedLogistics();
            seedContent();
        }
    }

    private void seedLogistics() {
        // Inventory
        inventoryItemRepository.saveAll(List.of(
            InventoryItem.builder().sku("SKU-SRV-001").productName("Global Server Rack").quantity(150).reorderPoint(20).warehouseLocation("Zone A-1").build(),
            InventoryItem.builder().sku("SKU-FBR-002").productName("Fiber Optic Cable (1km)").quantity(45).reorderPoint(50).warehouseLocation("Zone B-4").build(),
            InventoryItem.builder().sku("SKU-SSD-003").productName("SSD Drive 2TB").quantity(800).reorderPoint(100).warehouseLocation("Zone A-2").build()
        ));

        // Shipments
        shipmentRepository.saveAll(List.of(
            Shipment.builder().trackingId("TRK-001").origin("London").destination("New York").status(Shipment.ShipmentStatus.IN_TRANSIT).weight(BigDecimal.valueOf(500.5)).estimatedDelivery(LocalDateTime.now().plusDays(3)).build(),
            Shipment.builder().trackingId("TRK-002").origin("Berlin").destination("Tokyo").status(Shipment.ShipmentStatus.DELAYED).weight(BigDecimal.valueOf(120.0)).estimatedDelivery(LocalDateTime.now().plusDays(5)).build(),
            Shipment.builder().trackingId("TRK-003").origin("Singapore").destination("Sydney").status(Shipment.ShipmentStatus.DELIVERED).weight(BigDecimal.valueOf(850.2)).estimatedDelivery(LocalDateTime.now().minusDays(1)).build()
        ));

        // Vehicles
        vehicleRepository.saveAll(List.of(
            Vehicle.builder().plateNumber("LG-2026-X1").model("Volvo FH16").status(Vehicle.VehicleStatus.AVAILABLE).capacity(25.0).currentDriver("John Doe").build(),
            Vehicle.builder().plateNumber("LG-2026-Y4").model("Mercedes Actros").status(Vehicle.VehicleStatus.IN_USE).capacity(18.0).currentDriver("Jane Smith").build(),
            Vehicle.builder().plateNumber("LG-2026-M2").model("Scania R500").status(Vehicle.VehicleStatus.MAINTENANCE).capacity(22.0).build()
        ));

        // Routes
        routeRepository.saveAll(List.of(
            Route.builder().startLocation("Warehoue Alpha").endLocation("Port Terminal 1").distanceKm(45.2).estimatedTimeMinutes(90).status(Route.RouteOptimizationStatus.OPTIMIZED).build(),
            Route.builder().startLocation("Berlin Hub").endLocation("München Site").distanceKm(580.0).estimatedTimeMinutes(420).status(Route.RouteOptimizationStatus.PENDING).build()
        ));
    }

    private void seedContent() {
        // Projects
        Project p1 = projectRepository.save(Project.builder().projectName("Summer Brand Film 2026").clientName("Global Athletics").status(Project.ProjectStatus.IN_PROGRESS).startDate(LocalDate.now().minusMonths(1)).deadline(LocalDate.now().plusMonths(2)).budget(45000.0).build());
        Project p2 = projectRepository.save(Project.builder().projectName("Annual Report Graphics").clientName("Fincorp").status(Project.ProjectStatus.PLANNING).startDate(LocalDate.now()).deadline(LocalDate.now().plusWeeks(3)).budget(12000.0).build());
        Project p3 = projectRepository.save(Project.builder().projectName("Social Launch Rebrand").clientName("TechNova").status(Project.ProjectStatus.COMPLETED).startDate(LocalDate.now().minusMonths(3)).deadline(LocalDate.now().minusMonths(2)).budget(28000.0).build());

        // Assets
        contentAssetRepository.saveAll(List.of(
            ContentAsset.builder().title("Hero Shot 4K").type(ContentAsset.AssetType.VIDEO).fileUrl("https://cdn.cms.com/assets/hero.mp4").project(p1).build(),
            ContentAsset.builder().title("Brand Logo PNG").type(ContentAsset.AssetType.IMAGE).fileUrl("https://cdn.cms.com/assets/logo.png").project(p3).build(),
            ContentAsset.builder().title("Style Guide PDF").type(ContentAsset.AssetType.DOCUMENT).fileUrl("https://cdn.cms.com/assets/styles.pdf").project(p2).build()
        ));
    }
}
