package com.example.cms.config;

import com.example.cms.entity.*;
import com.example.cms.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private PasswordEncoder passwordEncoder;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void run(String... args) {

        /* =========================
           SECTOR INITIALIZATION
        ========================== */
        if (sectorRepository.count() == 0) {

            Sector banking = createSector("Banking", "Banking & Finance", "BANKING", "/banking");
            Sector healthcare = createSector("Healthcare", "Healthcare Services", "HEALTHCARE", "/healthcare");
            Sector logistics = createSector("Logistics", "Logistics & Supply Chain", "LOGISTICS", "/logistics");
            Sector content = createSector("Content", "Content Creation", "CONTENT", "/content");

            sectorRepository.save(banking);
            sectorRepository.save(healthcare);
            sectorRepository.save(logistics);
            sectorRepository.save(content);

            System.out.println("✅ Sectors initialized");
        }

        /* =========================
           USER INITIALIZATION
        ========================== */
        if (userRepository.count() == 0) {

            Sector bankingSector = sectorRepository.findByName("Banking").orElseThrow();
            Sector healthcareSector = sectorRepository.findByName("Healthcare").orElseThrow();
            Sector logisticsSector = sectorRepository.findByName("Logistics").orElseThrow();
            Sector contentSector = sectorRepository.findByName("Content").orElseThrow();

            User admin = new User("admin", passwordEncoder.encode("admin123"), User.Role.ADMIN);
            admin.setSector(bankingSector);
            userRepository.save(admin);

            User bankingUser = new User("bank_user", passwordEncoder.encode("bank123"), User.Role.BANKING);
            bankingUser.setSector(bankingSector);
            userRepository.save(bankingUser);

            User healthcareUser = new User("health_user", passwordEncoder.encode("health123"), User.Role.HEALTHCARE);
            healthcareUser.setSector(healthcareSector);
            userRepository.save(healthcareUser);

            User logisticsUser = new User("logistics_user", passwordEncoder.encode("logistics123"), User.Role.LOGISTICS);
            logisticsUser.setSector(logisticsSector);
            userRepository.save(logisticsUser);

            User contentUser = new User("content_user", passwordEncoder.encode("content123"), User.Role.CONTENT);
            contentUser.setSector(contentSector);
            userRepository.save(contentUser);

            System.out.println("✅ Test users initialized");
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
