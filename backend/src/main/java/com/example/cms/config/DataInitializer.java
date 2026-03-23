package com.example.cms.config;

import com.example.cms.entity.*;
import com.example.cms.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@Profile("!test") // 🔥 DO NOT RUN IN TESTS
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SectorRepository sectorRepository;

    @Autowired
    private BankAccountRepository bankAccountRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    private InventoryItemRepository inventoryItemRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ContentAssetRepository contentAssetRepository;

    @Autowired
    private com.example.cms.service.AuthService authService;


    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void run(String... args) {

        /* =========================
           SECTOR INITIALIZATION
        ========================== */
        if (sectorRepository.count() == 0) {

            Sector banking = createSector("Banking", "Banking & Finance", "BANKING", "/dashboard/banking");
            Sector healthcare = createSector("Healthcare", "Healthcare Services", "HEALTHCARE", "/dashboard/healthcare");
            Sector logistics = createSector("Logistics", "Logistics & Supply Chain", "LOGISTICS", "/dashboard/logistics");
            Sector content = createSector("Content", "Content Creation", "CONTENT", "/dashboard/content");

            sectorRepository.save(banking);
            sectorRepository.save(healthcare);
            sectorRepository.save(logistics);
            sectorRepository.save(content);

            System.out.println("✅ Sectors initialized");
        } else {
            // Force update routes for existing sectors
            Sector banking = sectorRepository.findByName("Banking").orElseThrow();
            if (!"/dashboard/banking".equals(banking.getRoutePath())) {
                banking.setRoutePath("/dashboard/banking");
                sectorRepository.save(banking);
            }
            Sector healthcare = sectorRepository.findByName("Healthcare").orElseThrow();
            if (!"/dashboard/healthcare".equals(healthcare.getRoutePath())) {
                healthcare.setRoutePath("/dashboard/healthcare");
                sectorRepository.save(healthcare);
            }
            Sector logistics = sectorRepository.findByName("Logistics").orElseThrow();
            if (!"/dashboard/logistics".equals(logistics.getRoutePath())) {
                logistics.setRoutePath("/dashboard/logistics");
                sectorRepository.save(logistics);
            }
            Sector content = sectorRepository.findByName("Content").orElseThrow();
            if (!"/dashboard/content".equals(content.getRoutePath())) {
                content.setRoutePath("/dashboard/content");
                sectorRepository.save(content);
            }
            System.out.println("✅ Sector routes updated");
        }

        /* =========================
           USER INITIALIZATION
        ========================== */
        if (userRepository.count() == 0) {

            Sector bankingSector = sectorRepository.findByName("Banking").orElseThrow();
            Sector healthcareSector = sectorRepository.findByName("Healthcare").orElseThrow();
            Sector logisticsSector = sectorRepository.findByName("Logistics").orElseThrow();
            Sector contentSector = sectorRepository.findByName("Content").orElseThrow();

            authService.createUser("admin", "admin@example.com", "admin123", User.Role.ADMIN, null);
            authService.createUser("bank_user", "banking@example.com", "bank123", User.Role.BANKING, bankingSector.getId());
            authService.createUser("health_user", "healthcare@example.com", "health123", User.Role.HEALTHCARE, healthcareSector.getId());
            authService.createUser("logistics_user", "logistics@example.com", "logistics123", User.Role.LOGISTICS, logisticsSector.getId());
            authService.createUser("content_user", "content@example.com", "content123", User.Role.CONTENT, contentSector.getId());

            System.out.println("✅ Test users initialized using AuthService");
        }

        /* =========================
           BANK ACCOUNTS
        ========================== */
        if (bankAccountRepository.count() == 0) {

            createAccount("ACC001", BankAccount.AccountType.CHECKING, "John Doe", "15420.50");
            createAccount("ACC002", BankAccount.AccountType.SAVINGS, "Jane Smith", "45230.75");
            createAccount("ACC003", BankAccount.AccountType.BUSINESS, "ABC Corp", "125000.00");
            createAccount("ACC004", BankAccount.AccountType.CREDIT, "Mike Johnson", "-2500.00");

            System.out.println("✅ Sample bank accounts initialized");
        }

        /* =========================
           TRANSACTIONS
        ========================== */
        if (transactionRepository.count() == 0) {

            Transaction txn1 = new Transaction(
                    "TXN001",
                    Transaction.TransactionType.DEPOSIT,
                    new BigDecimal("2500.00"),
                    "ACC001"
            );
            txn1.setStatus(Transaction.TransactionStatus.COMPLETED);
            txn1.setDescription("Salary deposit");
            transactionRepository.save(txn1);

            Transaction txn2 = new Transaction(
                    "TXN002",
                    Transaction.TransactionType.WITHDRAWAL,
                    new BigDecimal("150.00"),
                    "ACC002"
            );
            txn2.setStatus(Transaction.TransactionStatus.COMPLETED);
            txn2.setDescription("ATM withdrawal");
            transactionRepository.save(txn2);

            System.out.println("✅ Sample transactions initialized");
        }

        /* =========================
           PATIENTS
        ========================== */
        if (patientRepository.count() == 0) {

            Patient patient = new Patient("PAT001", "Sarah", "Johnson");
            patient.setAge(34);
            patient.setCondition("Hypertension");
            patient.setLastVisit(LocalDate.of(2024, 1, 15));
            patient.setStatus(Patient.PatientStatus.STABLE);
            patientRepository.save(patient);

            System.out.println("✅ Sample patients initialized");
        }

        /* =========================
           APPOINTMENTS
        ========================== */
        if (appointmentRepository.count() == 0) {

            Appointment apt = new Appointment(
                    "APT001",
                    "Sarah Johnson",
                    "Dr. Smith",
                    LocalDateTime.of(2024, 1, 20, 9, 0),
                    Appointment.AppointmentType.CONSULTATION
            );
            apt.setStatus(Appointment.AppointmentStatus.CONFIRMED);
            appointmentRepository.save(apt);

            System.out.println("✅ Sample appointments initialized");
        }

        /* =========================
           LOGISTICS: SHIPMENTS & INVENTORY
        ========================== */
        if (shipmentRepository.count() == 0) {
            Shipment ship1 = Shipment.builder()
                .trackingId("SHP-999-001")
                .origin("New York")
                .destination("Los Angeles")
                .status(Shipment.ShipmentStatus.IN_TRANSIT)
                .weight(new BigDecimal("150.5"))
                .estimatedDelivery(LocalDateTime.now().plusDays(3))
                .build();
            shipmentRepository.save(ship1);

            Shipment ship2 = Shipment.builder()
                .trackingId("SHP-999-002")
                .origin("Chicago")
                .destination("Houston")
                .status(Shipment.ShipmentStatus.PENDING)
                .weight(new BigDecimal("85.0"))
                .estimatedDelivery(LocalDateTime.now().plusDays(5))
                .build();
            shipmentRepository.save(ship2);
            System.out.println("✅ Sample shipments initialized");
        }

        if (inventoryItemRepository.count() == 0) {
            InventoryItem inv1 = InventoryItem.builder()
                .sku("SKU-1001")
                .productName("Industrial Widget")
                .quantity(500)
                .reorderPoint(100)
                .warehouseLocation("Warehouse A")
                .build();
            inventoryItemRepository.save(inv1);
            InventoryItem inv2 = InventoryItem.builder()
                .sku("SKU-1002")
                .productName("Electronic Component")
                .quantity(50)
                .reorderPoint(200)
                .warehouseLocation("Warehouse B")
                .build();
            inventoryItemRepository.save(inv2);
            System.out.println("✅ Sample inventory initialized");
        }

        /* =========================
           CONTENT CREATION: PROJECTS & ASSETS
        ========================== */
        if (projectRepository.count() == 0) {
            Project proj1 = Project.builder()
                .projectName("Q4 Marketing Campaign")
                .clientName("Acme Corp")
                .status(Project.ProjectStatus.IN_PROGRESS)
                .startDate(LocalDate.now().minusDays(10))
                .deadline(LocalDate.now().plusDays(20))
                .budget(15000.0)
                .build();
            projectRepository.save(proj1);

            Project proj2 = Project.builder()
                .projectName("Website Redesign")
                .clientName("Globex")
                .status(Project.ProjectStatus.PLANNING)
                .startDate(LocalDate.now().plusDays(5))
                .deadline(LocalDate.now().plusMonths(2))
                .budget(25000.0)
                .build();
            projectRepository.save(proj2);
            System.out.println("✅ Sample projects initialized");
        }

        if (contentAssetRepository.count() == 0) {
            Project parentProject = projectRepository.findAll().stream().findFirst().orElse(null);
            if (parentProject != null) {
                ContentAsset asset1 = ContentAsset.builder()
                    .title("Campaign Banner")
                    .type(ContentAsset.AssetType.IMAGE)
                    .fileUrl("https://example.com/assets/banner.jpg")
                    .project(parentProject)
                    .build();
                contentAssetRepository.save(asset1);
                
                ContentAsset asset2 = ContentAsset.builder()
                    .title("Marketing Video Draft")
                    .type(ContentAsset.AssetType.VIDEO)
                    .fileUrl("https://example.com/assets/draft.mp4")
                    .project(parentProject)
                    .build();
                contentAssetRepository.save(asset2);
            }
            System.out.println("✅ Sample content assets initialized");
        }
    }

    /* =========================
       HELPER METHODS
    ========================== */

    private Sector createSector(String name, String description, String code, String route) {

        ObjectNode config = objectMapper.createObjectNode();
        config.put("theme", "default");
        config.put("enabledFeatures", "basic");

        Sector sector = new Sector();
        sector.setName(name);
        sector.setDescription(description);
        sector.setCode(code);
        sector.setRoutePath(route);
        sector.setConfiguration(config);
        sector.setEnabled(true);
        sector.setDisplayOrder(0);

        return sector;
    }

    private void createAccount(String accNo, BankAccount.AccountType type, String name, String balance) {
        BankAccount acc = new BankAccount(accNo, type, name);
        acc.setBalance(new BigDecimal(balance));
        bankAccountRepository.save(acc);
    }
}
