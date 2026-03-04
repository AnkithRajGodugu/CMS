package com.example.cms.config;

import com.example.cms.entity.*;
import com.example.cms.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@Profile("!test") // Do NOT run in tests
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SectorRepository sectorRepository;
    private final CustomerRepository customerRepository;
    private final BankAccountRepository bankAccountRepository;
    private final TransactionRepository transactionRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final PasswordEncoder passwordEncoder;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void run(String... args) {

        /* =========================
           SECTOR INITIALIZATION
        ========================== */
        if (sectorRepository.count() == 0) {

            sectorRepository.save(createSector("Banking", "Banking & Finance", "BANKING", "/banking"));
            sectorRepository.save(createSector("Healthcare", "Healthcare Services", "HEALTHCARE", "/healthcare"));
            sectorRepository.save(createSector("Logistics", "Logistics & Supply Chain", "LOGISTICS", "/logistics"));
            sectorRepository.save(createSector("Content", "Content Creation", "CONTENT", "/content"));

            System.out.println("✅ Sectors initialized");
        }

        Sector banking = sectorRepository.findByName("Banking").orElseThrow();
        Sector healthcare = sectorRepository.findByName("Healthcare").orElseThrow();
        Sector logistics = sectorRepository.findByName("Logistics").orElseThrow();
        Sector content = sectorRepository.findByName("Content").orElseThrow();

        /* =========================
           USER INITIALIZATION
        ========================== */
        if (userRepository.count() == 0) {

            createUser("admin", "admin123", User.Role.ADMIN, banking);
            createUser("bank_user", "bank123", User.Role.BANKING, banking);
            createUser("health_user", "health123", User.Role.HEALTHCARE, healthcare);
            createUser("logistics_user", "logistics123", User.Role.LOGISTICS, logistics);
            createUser("content_user", "content123", User.Role.CONTENT, content);

            System.out.println("✅ Users initialized");
        }

        /* =========================
           CUSTOMERS (ALL SECTORS)
        ========================== */
        if (customerRepository.count() == 0) {

            seedCustomers(banking, "BankCustomer", 20);
            seedCustomers(healthcare, "HealthCustomer", 15);
            seedCustomers(logistics, "LogCustomer", 10);
            seedCustomers(content, "ContentCustomer", 8);

            System.out.println("✅ Customers initialized for all sectors");
        }

        /* =========================
           BANK ACCOUNTS
        ========================== */
        if (bankAccountRepository.count() == 0) {

            createAccount("ACC001", BankAccount.AccountType.CHECKING, "John Doe", "15420.50");
            createAccount("ACC002", BankAccount.AccountType.SAVINGS, "Jane Smith", "45230.75");
            createAccount("ACC003", BankAccount.AccountType.BUSINESS, "ABC Corp", "125000.00");
            createAccount("ACC004", BankAccount.AccountType.CREDIT, "Mike Johnson", "-2500.00");

            System.out.println("✅ Bank accounts initialized");
        }

        /* =========================
           TRANSACTIONS
        ========================== */
        if (transactionRepository.count() == 0) {

            createTransaction("TXN001", Transaction.TransactionType.DEPOSIT, "2500.00", "ACC001", "Salary deposit");
            createTransaction("TXN002", Transaction.TransactionType.WITHDRAWAL, "150.00", "ACC002", "ATM withdrawal");
            createTransaction("TXN003", Transaction.TransactionType.TRANSFER, "500.00", "ACC001", "Utility payment");

            System.out.println("✅ Transactions initialized");
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

            System.out.println("✅ Patients initialized");
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

            System.out.println("✅ Appointments initialized");
        }

        System.out.println("🚀 Data Initialization Completed");
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

    private void createUser(String username, String password, User.Role role, Sector sector) {
        User user = new User(username, passwordEncoder.encode(password), role);
        user.setSector(sector);
        userRepository.save(user);
    }

    private void seedCustomers(Sector sector, String prefix, int count) {
        for (int i = 1; i <= count; i++) {
            Customer c = new Customer();
            c.setFirstName(prefix + i);
            c.setLastName("Test");
            c.setEmail(prefix.toLowerCase() + i + "@mail.com");
            c.setSector(sector);
            customerRepository.save(c);
        }
    }

    private void createAccount(String accNo, BankAccount.AccountType type, String name, String balance) {
        BankAccount acc = new BankAccount(accNo, type, name);
        acc.setBalance(new BigDecimal(balance));
        bankAccountRepository.save(acc);
    }

    private void createTransaction(String txnNo,
                                   Transaction.TransactionType type,
                                   String amount,
                                   String accountNo,
                                   String description) {

        Transaction txn = new Transaction(
                txnNo,
                type,
                new BigDecimal(amount),
                accountNo
        );
        txn.setStatus(Transaction.TransactionStatus.COMPLETED);
        txn.setDescription(description);
        transactionRepository.save(txn);
    }
}